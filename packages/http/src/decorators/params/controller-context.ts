import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../../storages/metadata-storage.js';

/**
 *
 */
export function ControllerContext (this : unknown) {
  return function (target: unknown, propertyKey: string, index: number) {
    container.resolve(MetadataStorage).useParams.push({
      target,
      propertyName: propertyKey,
      index,
      decoratorName: 'ControllerContext', // context will never be shared or cached, i just don't want Typescript to be angry at me
      handle: 'controller-context',
      args: []
    });
  };
}
