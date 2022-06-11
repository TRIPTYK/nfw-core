import type { Class } from '@triptyk/nfw-core';
import type { EntityName } from '@mikro-orm/core';
import { MetadataStorage } from '../storage/metadata-storage.js';

export interface ResourceOptions<T> {
  entity : EntityName<T>,
}

export function JsonApiResource<T> (options: ResourceOptions<T>) {
  return function (target: Class<unknown>) {
    MetadataStorage.instance.resources.push({
      target,
      options
    })
  };
}
