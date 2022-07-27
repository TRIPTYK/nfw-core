import { MetadataStorage } from '../storage/metadata-storage.js';
import type { Class } from '@triptyk/nfw-core';

export interface ResourceOptions {
  entity : any,
  entityName : string,
}

export function JsonApiResource (options: ResourceOptions) {
  return function (target: Class<any>) {
    MetadataStorage.instance.resources.push({
      target,
      options
    })
  };
}
