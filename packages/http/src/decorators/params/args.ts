import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../../storages/metadata-storage.js';

export function Args (this: unknown) {
  return function (target: unknown, propertyKey: string, index: number) {
    container.resolve(MetadataStorage).useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: 'args',
      decoratorName: 'args',
      args: []
    });
  };
}
