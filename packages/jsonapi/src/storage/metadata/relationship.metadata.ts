import type { RelationshipOptions } from '../../decorators/relationship.decorator.js';

export interface RelationshipMetadataArgs {
  target: unknown,
  options: RelationshipOptions,
  propertyName: string,
}
