import type { Promisable } from 'type-fest';
import type { JsonApiQuery } from '../query/query.js';

export interface PaginationData {
  number: number,
  size: number,
  total: number,
}

export interface ResourceSerializer<T extends Record<string, unknown>> {
    serializeOne(resource: T, query: JsonApiQuery): Promisable<unknown>,
    serializeMany(resource: T[], query: JsonApiQuery, pageQuery?: PaginationData): Promisable<unknown>,
}
