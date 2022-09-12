import { Collection, MikroORM, ReferenceType, wrap } from '@mikro-orm/core';
import type { BaseEntity, QueryOrderMap, ObjectQuery, RequiredEntityData } from '@mikro-orm/core';
import { inject, injectable } from '@triptyk/nfw-core';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { Resource } from '../resource/base.resource.js';
import { ResourceNotFoundError } from '../errors/specific/resource-not-found.js';
import type { Sort, Include, Filter } from '../query-parser/query.js';

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
      offset: ctx.query!.page ? (ctx.query!.page * size) - 1 : undefined,
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
  public findOne (id :string, ctx: JsonApiContext<TModel>) {
    const { populate, fields, orderBy, filters } = this.setupRequestObjects(ctx);
    return this.repository.findOne(
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
    return this.findOne(id, ctx);
  }

  /**
   * Setups all the informations needed for an ORM query from the context
   * @param ctx The JsonApiContext
   */
  protected setupRequestObjects (ctx: JsonApiContext<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    if (ctx.query!.fields.has(this.resourceMeta.name)) {
      const attributes = ctx.query!.fields.get(this.resourceMeta.name)!;
      fields.push(...attributes.map((attr) => attr.name));
    } else {
      fields.push(...this.resourceMeta.attributes.map((a) => a.name));
    }

    for (const include of ctx.query!.includes.values()) {
      this.applyIncludes(populate, fields, ctx.query!.fields, include, []);
    }

    this.applySort(ctx.query!.sort, orderBy);

    return {
      populate,
      fields,
      orderBy,
      filters: this.applyFilter(ctx.query!.filters)
    };
  }

  /**
   * Generates the filter object
   */
  protected applyFilter (filters: Filter<TModel>): ObjectQuery<TModel> {
    const finalObject = {} as any;

    finalObject[filters.logical] = [];
    for (const iterator of filters.filters) {
      const filterObj = {};
      const expanded = this.expandObject(filterObj, iterator.path);
      expanded[iterator.operator] = iterator.value;

      finalObject[filters.logical].push(filterObj);
    }

    return finalObject;
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

    if (queryFields.has(parentInclude.relationMeta.resource.name)) {
      const attributes = queryFields.get(parentInclude.relationMeta.resource.name)!;
      fields.push(...attributes.map((attr) => `${joinPath}.${attr.name.toString()}`));
    } else {
      fields.push(...parentInclude.relationMeta.resource.attributes.map((attr) => `${joinPath}.${attr.name.toString()}`));
    }

    parentsPath.push(parentInclude.relationMeta.name);

    for (const include of parentInclude.includes.values()) {
      this.applyIncludes(populate, fields, queryFields, include, parentsPath);
    }
  }

  private expandObject (obj: Record<string, any>, path: string) {
    for (const opath of path.split('.')) {
      obj[opath] = {};
      obj = obj[opath];
    }
    return obj;
  }
}
