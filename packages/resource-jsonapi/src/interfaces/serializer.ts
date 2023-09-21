import type { Promisable } from 'type-fest';
import type { JsonApiQuery } from '../query/query.js';
import type { Resource } from './resource.js';

export interface ContextData {
  pagination? : {
    number: number,
    size: number,
    total: number,
  },
  /**
   * Endpoint URL relative to config host
   */
  endpointURL: string,
}

export interface ResourceSerializer {
    serializeOne(resource: Resource, query: JsonApiQuery, contextData: ContextData): Promisable<unknown>,
    serializeMany(resource: Resource[], query: JsonApiQuery, contextData: ContextData): Promisable<unknown>,
}
