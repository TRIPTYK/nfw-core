import { MetadataStorage } from '../storages/metadata-storage.js';
import type { RouteMethod } from '../storages/metadata/endpoint.metadata.js';

export function Endpoint (method: RouteMethod, args: unknown[]) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method,
      args
    });
  }
}
