import type { AttributeOptions } from '../../decorators/attribute.decorator.js';

export interface EntityAttributesMetadataArgs {
  target: unknown,
  propertyName: string,
  options?: AttributeOptions,
}
