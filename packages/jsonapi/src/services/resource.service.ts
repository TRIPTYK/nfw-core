/* eslint-disable max-statements */
import { Collection, MikroORM, ReferenceType, wrap } from '@mikro-orm/core';
import type { BaseEntity, QueryOrderMap, ObjectQuery, RequiredEntityData, EntityRepository } from '@mikro-orm/core';
import { inject, injectable } from '@triptyk/nfw-core';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { Resource } from '../resource/base.resource.js';
import { ResourceNotFoundError } from '../errors/specific/resource-not-found.js';
import type { Sort, Include, Filter, JsonApiQuery } from '../query-parser/query.js';
import { RelationshipEntityNotFoundError } from '../errors/specific/relationship-entity-not-found.js';
// eslint-disable-next-line import/no-named-default
import { default as merge } from 'ts-deepmerge';

@injectable()
export class ResourceService<TModel extends BaseEntity<any, 'id'>> {
  public declare resourceMeta: ResourceMeta<TModel>;

  public constructor (@inject(MikroORM) private orm: MikroORM) {}

  /**
   * Get the current repository for the service
   */
  public get repository () {
    return this.orm.em.getRepository<TModel>(this.resourceMeta.mikroEntity.class);
  }

  /**
   * Loads all entities, also applies sorting, includes, filters,... to the database request using context query
   * @param ctx The JsonApiContext
   * @returns
   */
  public findAll (ctx: JsonApiContext<TModel>) {
    const { populate, fields, orderBy, filters } = this.setupRequestObjects(ctx);

    const size = ctx.query!.size ?? 20;

    return this.repository.findAndCount(filters, {
      populate: populate as any,
      fields: fields as any,
      orderBy,
      limit: size,
      offset: ctx.query!.page ? (ctx.query!.page - 1) * size : undefined,
      filters: {
        context: {
          jsonApiContext: ctx
        }
      },
      disableIdentityMap: true
    });
  }

  /**
   * Creates an entity using a resource and persists it to the ORM, nothing special
   * @param resource The Resource object
   * @param _ctx The JsonApiContext
   * @returns
   */
  public async createOne (resource: Resource<TModel>, _ctx: JsonApiContext<TModel>) {
    const pojo = resource.toPojo() as unknown as RequiredEntityData<TModel>;
    await this.checkRelationshipsExistance(pojo);
    const entity = this.repository.create(pojo);
    this.repository.persist(entity);
    return entity;
  }

  /**
   * Updates a model from a resource
   */
  public async updateOne (resource: Resource<TModel>, ctx: JsonApiContext<TModel>) {
    const entity = await this.repository.findOne({ id: resource.id } as any, {
      filters: {
        context: {
          jsonApiContext: ctx
        }
      }
    });
    if (!entity) {
      throw new ResourceNotFoundError();
    }
    const pojo = resource.toPojo();
    for (const relationMeta of resource.resourceMeta.relationships) {
      const relationProperty = entity[relationMeta.name as keyof typeof entity];
      if (resource[relationMeta.name] && (relationMeta.mikroMeta.reference === ReferenceType.ONE_TO_MANY || relationMeta.mikroMeta.reference === ReferenceType.MANY_TO_MANY) && relationProperty instanceof Collection) {
        /**
         * Load and reset relation for to-many
         * "If a relationship is provided in the relationships member of a resource object in a PATCH request, its value MUST be a relationship object with a data member. The relationship’s value will be replaced with the value specified in this member."
         */
        await relationProperty.init();
        relationProperty.set([]);
      }
    }
    await this.checkRelationshipsExistance(pojo as RequiredEntityData<TModel>);
    wrap(entity).assign(pojo);
    // persists to ORM but does not save to database
    this.repository.persist(entity);
    return entity;
  }

  /**
   * Loads an entity by his id, also applies sorting, includes, filters,... to the database request using context query
   * @param id The primary key value
   * @param ctx The JsonApiContext
   * @returns
   */
  public async findOne (id :string, ctx: JsonApiContext<TModel>) {
    const { populate, fields, orderBy, filters } = this.setupRequestObjects(ctx);
    const one = await this.repository.findOne(
      { id, ...filters }, {
        populate: populate as any,
        fields: fields as any,
        filters: {
          context: {
            jsonApiContext: ctx
          }
        },
        disableIdentityMap: true,
        orderBy
      });

    if (!one) {
      throw new ResourceNotFoundError();
    }

    return one;
  }

  /**
     * Used by related routes to get the entity with a specific relation loaded
     * Use this.findOne internaly
     * @param id The primary key
     * @param ctx The JsonApiContext
     * @param relation The relation name
     * @returns
     */
  public async getOneWithRelation (id :string, ctx: JsonApiContext<TModel>, relation: string) {
    if (!ctx.query?.includes.has(relation)) {
      ctx.query?.includes.set(relation, {
        relationMeta: this.resourceMeta.relationships.find((rel) => rel.name === relation)!,
        includes: new Map()
      });
    }
    const one = await this.findOne(id, ctx);
    if (!one) {
      throw new ResourceNotFoundError();
    }
    return one;
  }

  /**
   * Generates the filter object
   */
  public applyFilter (filters: Filter<TModel>, parentFilter:Record<string, any>): ObjectQuery<TModel> {
    parentFilter[filters.logical] = [];
    let filter = {};
    for (const iterator of filters.filters) {
      const filterObj = {};
      const expanded = this.expandObject(filterObj, iterator.path);
      expanded[iterator.operator] = iterator.value;
      filter = (merge as any).default(filter, filterObj);
    }
    parentFilter[filters.logical].push(filter);
    if (filters.nested.size) {
      parentFilter[filters.logical] = [];
      filters.nested.forEach((filter) => {
        const tempFilterObject = {};
        parentFilter[filters.logical].push(tempFilterObject);
        this.applyFilter(filter, tempFilterObject);
      });
    }
    return parentFilter as ObjectQuery<TModel>;
  }

  public async checkRelationshipsExistance (pojo: RequiredEntityData<TModel>) {
    for (const relationship of this.resourceMeta.relationships) {
      if (Object.hasOwn(pojo, relationship.name)) {
        const relationshipValue = pojo[relationship.name as keyof RequiredEntityData<TModel>] as string[] | string;
        const relationRepository = this.orm.em.getRepository(relationship.resource.mikroEntity.class) as EntityRepository<any>;

        let relatedEntitiesExists : boolean;
        const isOneToOneRelation = relationship.mikroMeta.reference === ReferenceType.ONE_TO_ONE;

        if (isOneToOneRelation || relationship.mikroMeta.reference === ReferenceType.MANY_TO_ONE) {
          if (relationshipValue === null) {
            continue;
          }
          relatedEntitiesExists = (await relationRepository.findOne(relationshipValue)) !== null;
        } else {
          relatedEntitiesExists = (await relationRepository.find(relationshipValue)).length === (relationshipValue as string[]).length;
        }

        if (!relatedEntitiesExists) {
          throw new RelationshipEntityNotFoundError(`${relationship.name} not found`);
        }
      }
    }
  }

  /**
   * Setups all the informations needed for an ORM query from the context
   * @param ctx The JsonApiContext
   */
  protected setupRequestObjects (ctx: JsonApiContext<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    this.addToFields(this.resourceMeta, ctx.query?.fields!, fields);

    for (const include of ctx.query!.includes.values()) {
      this.applyIncludes(populate, fields, ctx.query!.fields, include, []);
    }

    this.applySort(ctx.query!.sort, orderBy);

    return {
      populate,
      fields,
      orderBy,
      filters: this.applyFilter(ctx.query!.filters, {})
    };
  }

  protected addToFields (resourceMeta: ResourceMeta<any>, queryFields: JsonApiQuery['fields'], fields: unknown[], joinPath?: string) {
    const attributes = resourceMeta.attributes.filter((a) => a.isFetchable && !a.isVirtual);

    if (queryFields.has(resourceMeta.name)) {
      const attributes = queryFields.get(resourceMeta.name)!;
      fields.push(...attributes.map((attr) => this.mapAttributesWithJoinPath(attr, joinPath)));
    } else {
      fields.push(...attributes.map((attr) => this.mapAttributesWithJoinPath(attr, joinPath)));
    }
  }

  /**
   * Generates the sort object
   */
  protected applySort (sort: Sort<TModel>, parentStructure: Record<string, any>) {
    for (const [key, value] of sort.attributes) {
      const sortOrder = value.direction === 'ASC' ? 1 : -1;
      parentStructure[key] = sortOrder;
    }

    for (const [key, sortValue] of sort.nested) {
      parentStructure[key] = {};
      this.applySort(sortValue, parentStructure[key]);
    }
  }

  /**
   * Re-map the query to FindOptions
   */
  protected applyIncludes (populate: string[], fields: string[], queryFields: Map<string, AttributeMeta<TModel>[]>, parentInclude: Include<any>, parentsPath: string[]) {
    const joinPath = parentsPath.length ? `${parentsPath?.join('.')}.${parentInclude.relationMeta.name}` : parentInclude.relationMeta.name;

    populate.push(joinPath);
    fields.push(joinPath);

    this.addToFields(parentInclude.relationMeta.resource, queryFields, fields, joinPath);

    parentsPath.push(parentInclude.relationMeta.name);

    for (const include of parentInclude.includes.values()) {
      this.applyIncludes(populate, fields, queryFields, include, parentsPath);
    }
  }

  private mapAttributesWithJoinPath (attr: AttributeMeta<any>, joinPath?: string) {
    return joinPath ? `${joinPath}.${attr.name}` : attr.name;
  }

  private expandObject (obj: Record<string, any>, path: string) {
    for (const opath of path.split('.')) {
      obj[opath] = {};
      obj = obj[opath];
    }
    return obj;
  }
}
