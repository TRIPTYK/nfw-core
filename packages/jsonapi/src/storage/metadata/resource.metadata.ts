import type { ResourceOptions } from '../../decorators/resource.decorator.js';

export interface ResourceMetadataArgs {
  target: unknown,
  options: ResourceOptions<any>,
}
