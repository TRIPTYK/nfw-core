import { MetadataStorage } from '../../storage/metadata-storage.js';

export function Context () {
  return function (target: any, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: 'jsonapi-context'
    });
  };
}
