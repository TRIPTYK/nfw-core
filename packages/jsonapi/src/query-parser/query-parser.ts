import type { BaseEntity } from '@mikro-orm/core';
import { container, injectable } from '@triptyk/nfw-core';
import Validator from 'fastest-validator';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { AttributeMeta, RelationMeta, ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { getSchema } from 'fastest-validator-decorators';
import { JsonApiQueryValidation } from '../validation/query.js';
import type { OperatorMap } from '@mikro-orm/core/typings.js';

export interface Sort<TModel extends BaseEntity<TModel, any>> {
  attributes: Map<string, {
    meta: AttributeMeta<any>,
    direction: 'ASC' | 'DESC',
  }>,
  nested: Map<string, Sort<any>>,
}

export interface Filter<TModel extends BaseEntity<TModel, any>> {
  filters: Set< {
    meta: AttributeMeta<any>,
    operator: keyof OperatorMap<any>,
    value: any,
  }>,
  logical: '$and' | '$or' | '$not',
  nested: Set<Filter<any>>,
}

export interface Include<TModel extends BaseEntity<TModel, any>> {
  relationMeta: RelationMeta<any>,
  includes: Map<string, Include<any>>,
}

export interface RawQuery {
  include?: string,
  fields?: Record<string, string>,
  filter?: Record<string, unknown>,
  sort?: string,
  page?: {
    size: string,
    number: string,
  },
  size?: string,
  // may contains unknown members
  [key: string]: unknown,
}

@injectable()
export class QueryParser<TModel extends BaseEntity<TModel, any>> {
  public declare context: JsonApiContext<TModel>;
  public fields: Map<string, AttributeMeta<any>[]> = new Map();
  public includes: Map<string, Include<any>> = new Map();
  public filters: Filter<any> = {
    filters: new Set(),
    logical: '$and',
    nested: new Set()
  };

  public sort: Sort<any> = {
    attributes: new Map(),
    nested: new Map()
  }

  public page?: number;
  public size?: number;

  public validate (query: RawQuery): Promise<void> | void {
    const v = new Validator();

    const check = v.compile(getSchema(JsonApiQueryValidation))(query);
    if (check !== true) {
      throw check;
    }
  }

  public parse (query: RawQuery): Promise<void> | void {
    const registry = container.resolve(JsonApiRegistry);

    this.page = query.page?.number ? query.page.number as unknown as number : undefined;
    this.size = query.page?.size ? query.page.size as unknown as number : undefined;

    /**
     * Allowed fields for resources types
     */
    for (const fieldName in query.fields) {
      const resource = registry.getResourceByName(fieldName);
      if (!resource) {
        throw new Error(`Resource ${fieldName} not found`);
      }

      this.fields.set(
        fieldName,
        query.fields[fieldName].split(',').map((field) => {
          const attr = resource.attributes.find((f) => f.name === field);
          if (!attr) {
            throw new Error(
              `Attribute ${field} not found in resource ${resource.name}`
            );
          }
          if (!attr.isFetchable) {
            throw new Error(`Attribute ${field} is not fetchable`);
          }
          return attr;
        })
      );
    }

    this.parseInclude(query.include?.split(',') ?? [], this.includes);
    this.parseFilters(this.filters, query.filter ?? {}, this.context.resource);

    for (const sort of (query.sort?.split(',') ?? [])) {
      const startsWithDesc = sort.startsWith('-');
      const direction = startsWithDesc ? 'DESC' : 'ASC';
      const realSortPath = startsWithDesc ? sort.slice(1) : sort;
      this.parseSort(realSortPath, this.sort, this.context.resource, direction);
    }
  }

  parseFilters (parentFilter: Filter<TModel>, filterObject: Record<string, unknown> | Record<string, unknown>[], parentEntity: ResourceMeta<any>, parentKey?:string) {
    if (Array.isArray(filterObject)) {
      for (const filter of filterObject) {
        this.parseFilters(parentFilter, filter as any, parentEntity, parentKey);
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
          this.parseFilters(nested, value as any, parentEntity, parentKey);
        } else {
          const meta: any = parentEntity.attributes.find((a) => a.name === parentKey)!;
          parentFilter.filters.add({
            meta,
            operator: key as any,
            value
          });
          if (meta.allowedFilters === undefined) {
            continue;
          }

          if (meta.allowedFilters === false) {
            throw new Error(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
          }

          if (!meta.allowedFilters[key]) {
            throw new Error(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
          }

          if (typeof meta.allowedFilters[key] === 'function') {
            if (meta.allowedFilters[key](value) !== true) {
              throw new Error(`${meta.name} of ${parentEntity.name} is not allowed to be filtered with ${key}`);
            }
          }
        }
      } else {
        const attrAndRel : (AttributeMeta<any> | RelationMeta<any>)[] = [...parentEntity.attributes, ...parentEntity.relationships];
        const found = attrAndRel.find((e) => e.name === key);

        if (found) {
          this.parseFilters(parentFilter, value as any, found.resource, key);
        } else {
          throw new Error(`Resource attribute/relation ${key} of ${parentEntity.name} does not exists`);
        }
      }
    }
  }

  parseInclude (
    relations: string[],
    parentInclude: Map<string, Include<any>> | Include<any>
  ) {
    for (const relation of relations) {
      const splitted = relation.split('.');
      const parentRel = splitted.shift()!;

      if (parentInclude instanceof Map) {
        const relationMeta = this.context.resource.relationships.find((rel) => rel.name === parentRel);
        if (!relationMeta) {
          throw new Error(`Relation ${parentRel} not found`);
        }
        parentInclude.set(parentRel, {
          relationMeta,
          includes: new Map()
        });
        if (splitted.length > 0) {
          this.parseInclude(splitted, parentInclude.get(parentRel)!);
        }
      } else {
        const relationMeta =
          parentInclude.relationMeta.resource.relationships.find((rel) => rel.name === parentRel);
        if (!relationMeta) {
          throw new Error(`Relation ${parentRel} not found`);
        }
        parentInclude.includes.set(parentRel, {
          relationMeta,
          includes: new Map()
        });
        if (splitted.length > 0) {
          this.parseInclude(splitted, parentInclude.includes.get(parentRel)!);
        }
      }
    }
  }

  parseSort (
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
        throw new Error(`Field ${parentRel} not found in sort`)
      }

      if (!meta.allowedSortDirections.includes(direction)) {
        throw new Error(`Field ${parentRel} is not allowed to be sorted by ${direction}`);
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
      throw new Error(`Unknown relationship in sort fields ${parentRel}`);
    }

    for (const sort of splitted) {
      this.parseSort(sort, newParent, newParentResource.resource, direction);
    }
  }
}
