import type { BaseEntity, EntityRepository, QueryOrderMap } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { Include, QueryParser, Sort } from '../query-parser/query-parser.js';

export class ResourceService<TModel extends BaseEntity<TModel, any>> {
  public declare repository: EntityRepository<TModel>;
  public declare resourceMeta: ResourceMeta<TModel>;

  public findAll (query: QueryParser<TModel>, jsonApiContext: JsonApiContext<TModel>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<TModel> = {};

    for (const include of query.includes.values()) {
      if (query.fields.has(jsonApiContext.resource.name)) {
        const attributes = query.fields.get(jsonApiContext.resource.name)!;
        fields.push(...attributes.map((attr) => attr.name));
      } else {
        fields.push('*');
      }
      this.applyIncludes(populate, fields, query.fields, include, [])
    }

    this.applySort(query.sort, orderBy);

    const size = query.size ?? 20;

    return this.repository.find({} as any, {
      populate: populate as any,
      fields: fields as any,
      orderBy,
      limit: size,
      offset: query.page ? (query.page * size) - 1 : undefined
    });
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
      fields.push(`${joinPath}.*`)
    }

    parentsPath.push(parentInclude.relationMeta.name);

    for (const include of parentInclude.includes.values()) {
      this.applyIncludes(populate, fields, queryFields, include, parentsPath)
    }
  }
}
