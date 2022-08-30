import type { BaseEntity } from '@mikro-orm/core';
import type { OperatorMap } from '@mikro-orm/core/typings.js';
import type { AttributeMeta, RelationMeta } from '../jsonapi.registry.js';

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
      path: string,
    }>,
    logical: '$and' | '$or' | '$not',
    nested: Set<Filter<any>>,
  }

export interface Include<TModel extends BaseEntity<TModel, any>> {
    relationMeta: RelationMeta<any>,
    includes: Map<string, Include<any>>,
  }

export interface RawQuery {
      // may contains unknown members
    [key: string]: unknown,
    include?: string,
    fields?: Record<string, string>,
    filter?: Record<string, unknown>,
    sort?: string,
    page?: {
      size: string,
      number: string,
    },
    size?: string,
  }

export class JsonApiQuery {
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
}
