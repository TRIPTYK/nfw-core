import type { BaseEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import type { ResourceOptions } from '../../decorators/resource.decorator.js';
import type { Resource } from '../../resource/base.resource.js';

export interface ResourceMetadataArgs<T extends BaseEntity<any, 'id'>> {
  target: Class<Resource<BaseEntity<any, 'id'>>>,
  options: ResourceOptions<T>,
}
