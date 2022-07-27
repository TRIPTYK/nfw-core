import type { BaseEntity } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import type { ResourceOptions } from '../../decorators/resource.decorator.js';
import type { Resource } from '../../resource/base.resource.js';

export interface ResourceMetadataArgs {
  target: Class<Resource<BaseEntity<any, any>>>,
  options: ResourceOptions,
}
