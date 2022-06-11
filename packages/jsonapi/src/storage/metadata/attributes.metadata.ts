import type { AttributeOptions } from '../../decorators/attribute.decorator.js';

export interface EntityAttributesMetadataArgs {
  target: unknown,
  options: AttributeOptions,
  propertyName: string,
}
