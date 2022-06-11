
import { MetadataStorage } from '../storage/metadata-storage.js';

export interface RelationshipOptions {
  otherResource: string,
}

export function Relationship (options: RelationshipOptions) {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.relationships.push({
      target,
      propertyName,
      options
    })
  };
}
