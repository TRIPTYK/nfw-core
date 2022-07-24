/* eslint-disable new-cap */
import type { AnyEntity, QueryOrderMap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { AttributeMeta, ResourceMeta } from '../jsonapi.registry.js';
import type { Include, QueryParser, Sort } from '../query-parser/query-parser.js';

/**
 * The repository choose how use the data from the request with the database
 */
export abstract class JsonApiRepository<T extends AnyEntity<T>> extends EntityRepository<T> {
  declare meta: ResourceMeta;

  async jsonApiList (query: QueryParser, jsonApiContext: JsonApiContext<T>) {
    const populate : string[] = [];
    const fields : string[] = [];
    const orderBy : QueryOrderMap<T> = {};

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

    return this.find({} as any, {
      populate: populate as any,
      fields: fields as any,
      orderBy,
      limit: size,
      offset: query.page ? (query.page * size) - 1 : undefined
    });
  }

  /**
   * Apply (nested) sort
   */
  protected applySort (sort: Sort, parentStructure: Record<string, any>) {
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
  protected applyIncludes (populate: string[], fields: string[], queryFields: Map<string, AttributeMeta[]>, parentInclude: Include, parentsPath: string[]) {
    const joinPath = parentsPath.length ? `${parentsPath?.join('.')}.${parentInclude.relationMeta.name}` : parentInclude.relationMeta.name;

    populate.push(joinPath);

    if (queryFields.has(parentInclude.relationMeta.resource.name)) {
      const attributes = queryFields.get(parentInclude.relationMeta.resource.name)!;
      fields.push(...attributes.map((attr) => `${joinPath}.${attr.name}`));
    } else {
      fields.push(`${joinPath}.*`)
    }

    parentsPath.push(parentInclude.relationMeta.name);

    for (const include of parentInclude.includes.values()) {
      this.applyIncludes(populate, fields, queryFields, include, parentsPath)
    }
  }
}
