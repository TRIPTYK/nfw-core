import type { BaseEntity } from '@mikro-orm/core';
import { container, injectable } from '@triptyk/nfw-core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { AttributeMeta, RelationMeta, ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';

export interface Sort<TModel extends BaseEntity<TModel, any>> {
  attributes: Map<string, {
    meta: AttributeMeta<any>,
    direction: 'ASC' | 'DESC',
  }>,
  nested: Map<string, Sort<any>>,
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
  page?: string,
  size?: string,
  // may contains unknown members
  [key: string]: unknown,
}

@injectable()
export class QueryParser<TModel extends BaseEntity<TModel, any>> {
  public declare context: JsonApiContext<TModel>;
  public fields: Map<string, AttributeMeta<any>[]> = new Map();
  public includes: Map<string, Include<any>> = new Map();
  public sort: Sort<any> = {
    attributes: new Map(),
    nested: new Map()
  }

  public page?: number;
  public size?: number;

  public parse (query: RawQuery) {
    const registry = container.resolve(JsonApiRegistry);
    this.page = query.page ? parseInt(query.page) : undefined;
    this.size = query.size ? parseInt(query.size) : undefined;

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
          return attr;
        })
      );
    }

    this.parseInclude(query.include?.split(',') ?? [], this.includes);

    for (const sort of (query.sort?.split(',') ?? [])) {
      const startsWithDesc = sort.startsWith('-');
      const direction = startsWithDesc ? 'DESC' : 'ASC';
      const realSortPath = startsWithDesc ? sort.slice(1) : sort;
      this.parseSort(realSortPath, this.sort, this.context.resource, direction);
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
