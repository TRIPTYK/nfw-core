
import type { Class } from 'type-fest';
import type { QueryParser } from '../query-parser/query-parser.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

export interface JsonApiOptions {
  /**
   * Changes the allowed content-type for endpoint
   * Use in case of absolute necessity, break the spec
   */
    allowedContentType?: string,
  /**
   * Disables the media types check allowed in content-type
   * Use in case of absolute necessity, break the spec
   */
    ignoreMedia?: boolean,
    /**
     * Use a specific query parser for this endpoint
     */
    queryParser?: Class< QueryParser<any>>,
}

export interface JsonApiGetOptions extends JsonApiOptions {}

export function JsonApiGet (options?: JsonApiGetOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET,
      options
    });
  };
}

export interface JsonApiCreateOptions extends JsonApiOptions {
  /**
   * The validation Schema from fastest-validator-decorators
  */
  validation?: Class<unknown>,
}

export function JsonApiCreate (options?: JsonApiCreateOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.CREATE,
      options
    });
  };
}

export interface JsonApiListOptions extends JsonApiOptions {};

export function JsonApiList (options?: JsonApiListOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.LIST,
      options
    });
  };
}

export interface JsonApiUpdateOptions extends JsonApiOptions {
    /**
     * The validation Schema from fastest-validator-decorators
    */
    validation?: Class<unknown>,
}

export function JsonApiUpdate (options?: JsonApiUpdateOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.UPDATE,
      options
    });
  };
}

export interface JsonApiDeleteOptions extends JsonApiOptions {}

export function JsonApiDelete (options?: JsonApiDeleteOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.DELETE,
      options
    });
  };
}

export interface JsonApiGetRelationshipsOptions extends JsonApiOptions {}

export function JsonApiGetRelationships (options?: JsonApiGetRelationshipsOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET_RELATIONSHIPS,
      options
    });
  };
}

export interface JsonApiGetRelatedOptions extends JsonApiOptions {}

export function JsonApiGetRelated (options?: JsonApiGetRelatedOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET_RELATED,
      options
    });
  };
}
