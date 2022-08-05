import { MetadataStorage } from '../storage/metadata-storage.js';
import type { Class } from '@triptyk/nfw-core';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';

export interface ResourceOptions {
  entity : any,
  entityName : string,
  serializer?: Class<ResourceSerializer<any>>,
  service?: Class<ResourceService<any>>,
}

export function JsonApiResource (options: ResourceOptions) {
  return function (target: Class<any>) {
    MetadataStorage.instance.resources.push({
      target,
      options
    })
  };
}
