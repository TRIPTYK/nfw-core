
import type { Class } from 'type-fest';
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

export function JsonApiCreate (options?: JsonApiGetOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.CREATE,
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

export interface JsonApiUpdateOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiUpdate (options?: JsonApiUpdateOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.UPDATE,
      queryParser: options?.queryParser
    });
  }
}

export interface JsonApiDeleteOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiDelete (options?: JsonApiDeleteOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.DELETE,
      queryParser: options?.queryParser
    });
  }
}

export interface JsonApiGetRelationshipsOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiGetRelationships (options?: JsonApiGetRelationshipsOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET_RELATIONSHIPS,
      queryParser: options?.queryParser
    });
  }
}

export interface JsonApiGetRelatedOptions {
  queryParser: Class< QueryParser<any>>,
}

export function JsonApiGetRelated (options?: JsonApiGetRelatedOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET_RELATED,
      queryParser: options?.queryParser
    });
  }
}
