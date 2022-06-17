
import { HttpMethod } from '@triptyk/nfw-http';
import { MetadataStorage } from '../storage/metadata-storage.js';

export function JsonApiGet () {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: HttpMethod.GET
    });
  }
}
