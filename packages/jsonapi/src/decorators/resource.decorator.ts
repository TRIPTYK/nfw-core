import { MetadataStorage } from '../storage/metadata-storage.js';
import type { Class } from '@triptyk/nfw-core';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';
import type { ResourceDeserializer } from '../deserializers/resource.deserializer.js';

export interface ResourceOptions {
  entity : any,
  entityName : string,
  serializer?: Class<ResourceSerializer<any>>,
  deserializer?: Class<ResourceDeserializer<any>>,
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
