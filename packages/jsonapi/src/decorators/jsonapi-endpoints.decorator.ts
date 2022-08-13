
import type { Class } from '@triptyk/nfw-core';
import type { QueryParser } from '../query-parser/query-parser.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

export interface JsonApiGetOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiGet (options?: JsonApiGetOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET,
      queryParser: options?.queryParser
    });
  }
}

export interface JsonApiListOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiList (options?: JsonApiListOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.LIST,
      queryParser: options?.queryParser
    });
  }
}
