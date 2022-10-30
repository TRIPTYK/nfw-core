
import type { LinksObject } from '../serializers/spec.interface.js';
import { MetadataStorage } from '../storage/metadata-storage.js';

export interface RelationshipOptions<T> {
  otherResource: string,
  links?: (this: T) => LinksObject<string>,
}

export function Relationship<T> (options: RelationshipOptions<T>) {
  return function (target: T, propertyName: string) {
    MetadataStorage.instance.relationships.push({
      target,
      propertyName,
      options: options as any
    });
  };
}
