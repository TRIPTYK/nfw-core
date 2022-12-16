/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
import type { BaseEntity } from '@mikro-orm/core';
import { container, injectable } from '@triptyk/nfw-core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { AttributeMeta, RelationMeta, ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { BadRequestError } from '../errors/bad-request.js';
import type { Filter, Include, RawQuery, Sort } from './query.js';
import { JsonApiQuery } from './query.js';

@injectable()
export class QueryParser<TModel extends BaseEntity<TModel, any>> {
  public declare context: JsonApiContext<TModel>;

  public validate (_query: RawQuery): Promise<void> | void {}

  public parse (query: RawQuery): Promise<JsonApiQuery> | JsonApiQuery {
    const registry = container.resolve(JsonApiRegistry);

    const jsonApiQuery = new JsonApiQuery();

    jsonApiQuery.page = query.page?.number ? parseInt(query.page.number, 10) : undefined;
    jsonApiQuery.size = query.page?.size ? parseInt(query.page.size, 10) : undefined;

    /**
     * Allowed fields for resources types
     */
    for (const fieldName in query.fields) {
      const resource = registry.getResourceByName(fieldName);
      if (!resource) {
        throw new BadRequestError(`Resource ${fieldName} not found`);
      }

      jsonApiQuery.fields.set(
        fieldName,
        query.fields[fieldName].split(',').map((field) => {
          const attr = resource.attributes.find((f) => f.name === field);
          if (!attr) {
            throw new BadRequestError(
              `Attribute ${field} not found in resource ${resource.name}`
            );
          }
          if (!attr.isFetchable) {
            throw new BadRequestError(`Attribute ${field} is not fetchable`);
          }
          return attr;
        })
      );
    }

    for (const include of query.include?.split(',') ?? []) {
      this.parseInclude(include, jsonApiQuery.includes, this.context.resource);
    }

    this.parseFilters(query.filter ?? {}, jsonApiQuery.filters, this.context.resource);

    for (const sort of (query.sort?.split(',') ?? [])) {
      const startsWithDesc = sort.startsWith('-');
      const direction = startsWithDesc ? 'DESC' : 'ASC';
      const sortDottedPath = startsWithDesc ? sort.slice(1) : sort;
      this.parseSort(sortDottedPath, jsonApiQuery.sort, this.context.resource, direction);
    }

    return jsonApiQuery;
  }

  public parseFilters (filterObject: Record<string, unknown> | Record<string, unknown>[], parentFilter: Filter<TModel>, parentEntity: ResourceMeta<any>, parents:string[] = []) {
    if (Array.isArray(filterObject)) {
      for (const filter of filterObject) {
        this.parseFilters(filter as any, parentFilter, parentEntity, parents);
      }
      return;
    }

    for (const [key, value] of Object.entries(filterObject)) {
      if (key.startsWith('$')) {
        if (['$and', '$or', '$not'].includes(key)) {
          const nested: Filter<any> = {
            logical: key as '$and' | '$or' | '$not',
            nested: new Set(),
            filters: new Set()
          };
          parentFilter.nested.add(nested);
          this.parseFilters(value as any, nested, parentEntity, parents);
        } else {
          const child = parents[parents.length - 1];
          const attrAndRel : (AttributeMeta<any> | RelationMeta<any>)[] = [...parentEntity.attributes, ...parentEntity.relationships];
          const meta: any = attrAndRel.find((a) => a.name === child);

          if (!meta) {
            throw new BadRequestError(`${child} property not found in ${parentEntity.name}`);
          }

          parentFilter.filters.add({
            path: parents.join('.'),
            meta,
            operator: key as any,
            value
          });

          if (meta.allowedFilters === undefined) {
            continue;
          }

          if (meta.allowedFilters === false) {
            throw new BadRequestError(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
          }

          if (!meta.allowedFilters[key]) {
            throw new BadRequestError(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
          }

          if (typeof meta.allowedFilters[key] === 'function') {
            if (meta.allowedFilters[key](value) !== true) {
              throw new BadRequestError(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
            }
          }
        }
      } else {
        const attrAndRel : (AttributeMeta<any> | RelationMeta<any>)[] = [...parentEntity.attributes, ...parentEntity.relationships];
        const found = attrAndRel.find((e) => e.name === key);

        if (found) {
          this.parseFilters(value as any, parentFilter, found.resource, [...parents, key]);
        } else {
          throw new BadRequestError(`Resource attribute/relation ${key} of ${parentEntity.name} does not exists`);
        }
      }
    }
  }

  /*
    comments,comments.locales,comments.locales.comment,comments.article
    {
      comments: {
        meta : ...
        includes : {
          locales : {
            meta : ...
            includes: {
              comment: {
                meta: ...
                includes: {}
              }
            }
          },
          article: {
            meta: ...
            includes: {}
          }
        }
      }
    }
  */
  public parseInclude (
    relation: string,
    parentInclude: Map<string, Include<any>>,
    parentResource: ResourceMeta<TModel>
  ) {
    const paths = relation.split('.');
    const currentRelation = paths.shift();
    const restOfPaths = paths.join('.');

    const relationMeta = parentResource.relationships.find((relationship) => relationship.name === currentRelation);

    if (!relationMeta) {
      throw new BadRequestError(`${currentRelation} was not found in resource ${parentResource.name}`);
    }

    const existingChildRelation = parentInclude.get(relationMeta.name);

    if (!existingChildRelation) {
      parentInclude.set(relationMeta.name, {
        relationMeta,
        includes: new Map()
      });
    }

    if (restOfPaths) {
      this.parseInclude(restOfPaths, parentInclude.get(relationMeta.name)!.includes, relationMeta.resource);
    }
  }

  public parseSort (
    sort: string,
    parentSort: Sort<any>,
    parentResource: ResourceMeta<TModel>,
    direction: 'ASC'| 'DESC'
  ) {
    const splitted = sort.split('.');
    const parentRel = splitted.shift()!;

    /** This is an attribute */
    if (splitted.length === 0) {
      const meta = parentResource.attributes.find((r) => r.name === parentRel);

      if (!meta) {
        throw new BadRequestError(`Field ${parentRel} not found in sort`);
      }

      if (!meta.allowedSortDirections.includes(direction)) {
        throw new BadRequestError(`Field ${parentRel} is not allowed to be sorted by ${direction}`);
      }

      parentSort.attributes.set(parentRel, {
        direction,
        meta
      });
      return;
    }

    const newParent: Sort<any> = {
      attributes: new Map(),
      nested: new Map()
    };
    parentSort.nested.set(parentRel, newParent);

    const newParentResource = parentResource.relationships.find((r) => r.name === parentRel);

    if (!newParentResource) {
      throw new BadRequestError(`Unknown relationship in sort fields ${parentRel}`);
    }

    for (const sort of splitted) {
      this.parseSort(sort, newParent, newParentResource.resource, direction);
    }
  }
}
