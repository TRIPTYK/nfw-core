import { MetadataStorage } from '../storage/metadata-storage.js';

export function Attribute () {
  return function (target: unknown, propertyName: string) {
    MetadataStorage.instance.attributes.push({
      target,
      propertyName
    })
  };
}
