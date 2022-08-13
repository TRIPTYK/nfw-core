import { MikroORM } from '@mikro-orm/core';
import type { BaseEntity, QueryOrderMap, ObjectQuery } from '@mikro-orm/core';
import { inject, injectable } from '@triptyk/nfw-core';
import { databaseInjectionToken } from '@triptyk/nfw-mikro-orm';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { Filter, Include, QueryParser, Sort } from '../query-parser/query-parser.js';

@injectable()
export class ResourceService<TModel extends BaseEntity<TModel, any>> {
  public declare resourceMeta: ResourceMeta<TModel>;

  constructor (@inject(databaseInjectionToken) private orm: MikroORM) {}

  public findAll (query: QueryParser<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    if (query.fields.has(this.resourceMeta.name)) {
      const attributes = query.fields.get(this.resourceMeta.name)!;
      fields.push(...attributes.map((attr) => attr.name));
    } else {
      fields.push(...this.resourceMeta.attributes.map((a) => a.name));
    }

    for (const include of query.includes.values()) {
      this.applyIncludes(populate, fields, query.fields, include, [])
    }

    this.applySort(query.sort, orderBy);

    const size = query.size ?? 20;

    return this.orm.em.getRepository<TModel>(this.resourceMeta.mikroEntity.class).findAndCount(
      this.applyFilter(query.filters), {
        populate: populate as any,
        fields: fields as any,
        orderBy,
        limit: size,
        offset: query.page ? (query.page * size) - 1 : undefined
      });
  }

  public findOne (query: QueryParser<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    if (query.fields.has(this.resourceMeta.name)) {
      const attributes = query.fields.get(this.resourceMeta.name)!;
      fields.push(...attributes.map((attr) => attr.name));
    } else {
      fields.push(...this.resourceMeta.attributes.map((a) => a.name));
    }

    for (const include of query.includes.values()) {
      this.applyIncludes(populate, fields, query.fields, include, [])
    }

    this.applySort(query.sort, orderBy);

    return this.orm.em.getRepository<TModel>(this.resourceMeta.mikroEntity.class).findOne(
      { id: query.context.koaContext.params.id, ...this.applyFilter(query.filters) }, {
        populate: populate as any,
        fields: fields as any,
        orderBy
      });
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
