import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../../storages/metadata-storage.js';

export function ControllerContext (this : unknown) {
  return function (target: unknown, propertyKey: string, index: number) {
    container.resolve(MetadataStorage).addParamUsage({
      target,
      propertyName: propertyKey,
      index,
      decoratorName: 'ControllerContext',
      handle: 'controller-context',
      args: []
    });
  };
}
