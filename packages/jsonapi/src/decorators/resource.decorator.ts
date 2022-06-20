import type { EntityName } from '@mikro-orm/core';
import { MetadataStorage } from '../storage/metadata-storage.js';
import type { Resource } from '../resource/base.resource.js';
import type { Class } from '@triptyk/nfw-core';

export interface ResourceOptions<T> {
  entity :EntityName<T>,
  entityName : string,
}

export function JsonApiResource<T> (options: ResourceOptions<T>) {
  return function (target: Class<Resource<unknown>>) {
    MetadataStorage.instance.resources.push({
      target,
      options
    })
  };
}
