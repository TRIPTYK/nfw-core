import type { ResourceContext } from '../resource/base.resource.js';
import { MetadataStorage } from '../storage/metadata-storage.js';

export interface AttributeOptions {
  sortable?: boolean | ((ctx: ResourceContext) => boolean),
  fetchable?: boolean | ((ctx: ResourceContext) => boolean),
  createable?: boolean | ((ctx: ResourceContext) => boolean),
  updateable?: boolean | ((ctx: ResourceContext) => boolean),
  filterable?: boolean | ((ctx: ResourceContext) => boolean),
}

export function Attribute (options?: AttributeOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.attributes.push({
      target,
      propertyName,
      options: options ?? {}
    })
  };
}
