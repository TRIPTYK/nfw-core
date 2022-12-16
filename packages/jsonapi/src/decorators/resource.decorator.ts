import { MetadataStorage } from '../storage/metadata-storage.js';
import type { Class } from 'type-fest';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';
import type { ResourceDeserializer } from '../deserializers/resource.deserializer.js';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';

export interface ResourceOptions<T extends BaseEntity<any, 'id'>> {
  entity : any,
  entityName : string,
  serializer?: Class<ResourceSerializer<T>>,
  deserializer?: Class<ResourceDeserializer<T>>,
  service?: Class<ResourceService<T>>,
}

export function JsonApiResource (options: ResourceOptions<any>) {
  return function (target: Class<any>) {
    container.resolve(MetadataStorage).resources.push({
      target,
      options
    });
  };
}
