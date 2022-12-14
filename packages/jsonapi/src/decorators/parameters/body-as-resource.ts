import { MetadataStorage } from '../../storage/metadata-storage.js';

export function BodyAsResource () {
  return function (target: any, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: 'body-as-resource'
    });
  };
}
