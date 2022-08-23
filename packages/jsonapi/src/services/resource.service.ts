import { Collection, MikroORM, ReferenceType, wrap } from '@mikro-orm/core';
import type { BaseEntity, QueryOrderMap, ObjectQuery, RequiredEntityData } from '@mikro-orm/core';
import { inject, injectable } from '@triptyk/nfw-core';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { Filter, Include, Sort } from '../query-parser/query-parser.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { Resource } from '../resource/base.resource.js';

@injectable()
export class ResourceService<TModel extends BaseEntity<TModel, any>> {
  public declare resourceMeta: ResourceMeta<TModel>;

  get repository () {
    return this.orm.em.getRepository<TModel>(this.resourceMeta.mikroEntity.class);
  }

  public constructor (@inject(MikroORM) private orm: MikroORM) {}

  /**
   * Loads all entities, also applies sorting, includes, filters,... to the database request using context query
   * @param ctx The JsonApiContext
   * @returns
   */
  public findAll ({ query }: JsonApiContext<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    if (query!.fields.has(this.resourceMeta.name)) {
      const attributes = query!.fields.get(this.resourceMeta.name)!;
      fields.push(...attributes.map((attr) => attr.name));
    } else {
      fields.push(...this.resourceMeta.attributes.map((a) => a.name));
    }

    for (const include of query!.includes.values()) {
      this.applyIncludes(populate, fields, query!.fields, include, [])
    }

    this.applySort(query!.sort, orderBy);

    const size = query!.size ?? 20;

    return this.repository.findAndCount(
      this.applyFilter(query!.filters), {
        populate: populate as any,
        fields: fields as any,
        orderBy,
        limit: size,
        offset: query!.page ? (query!.page * size) - 1 : undefined
      });
  }

  /**
   * Creates an entity using a resource and persists it to the ORM, nothing special
   * @param resource The Resource object
   * @param _ctx The JsonApiContext
   * @returns
   */
  public async createOne (resource: Resource<TModel>, _ctx: JsonApiContext<TModel>) {
    const pojo = resource.toMikroPojo() as unknown as RequiredEntityData<TModel>;
    const entity = this.repository.create(pojo);
    this.repository.persist(entity);
    return entity;
  }

  public async updateOne (resource: Resource<TModel>, _ctx: JsonApiContext<TModel>) {
    const entity = await this.repository.findOneOrFail({ id: resource.id } as any);
    const pojo = resource.toMikroPojo();
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
      this.applyIncludes(populate, fields, ctx.query!.fields, include, [])
    }

    this.applySort(ctx.query!.sort, orderBy);

    return this.orm.em.getRepository<TModel>(this.resourceMeta.mikroEntity.class).findOne(
      { id, ...this.applyFilter(ctx.query!.filters) }, {
        populate: populate as any,
        fields: fields as any,
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
    const one = await this.findOne(id, ctx);
    // load the relation, need to be loaded anyway
    if (one) {
      await this.orm.em.populate(one, [relation as any]);
    }
    return one;
  }

  protected applyFilter (filters: Filter<TModel>): ObjectQuery<TModel> {
    const finalObject = {} as any; ;
    finalObject[filters.logical] = [];
    for (const iterator of filters.filters) {
      finalObject[filters.logical].push({
        [iterator.operator]: [iterator.value]
      })
    }

    return finalObject;
  }

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

    if (queryFields.has(parentInclude.relationMeta.resource.name)) {
      const attributes = queryFields.get(parentInclude.relationMeta.resource.name)!;
      fields.push(...attributes.map((attr) => `${joinPath}.${attr.name.toString()}`));
    } else {
      fields.push(...parentInclude.relationMeta.resource.attributes.map((attr) => `${joinPath}.${attr.name.toString()}`))
    }

    parentsPath.push(parentInclude.relationMeta.name);

    for (const include of parentInclude.includes.values()) {
      this.applyIncludes(populate, fields, queryFields, include, parentsPath)
    }
  }
}
