
import { MetadataStorage } from '../storage/metadata-storage.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

export function JsonApiGet () {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.GET
    });
  }
}

export function JsonApiList () {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: JsonApiMethod.LIST
    });
  }
}
