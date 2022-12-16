import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../../storage/metadata-storage.js';

export function Context () {
  return function (target: any, propertyName: string, index: number) {
    container.resolve(MetadataStorage).useParams.push({
      target,
      propertyName,
      index,
      decoratorName: 'jsonapi-context'
    });
  };
}
