import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ControllerParamsContext } from '../storages/metadata/use-param.js';

export function createCustomDecorator (handle: (ctx: ControllerParamsContext) => unknown, name: string, args: unknown[] = []) {
  return function (target: unknown, propertyName: string, index: number) {
    container.resolve(MetadataStorage).useParams.push({
      target,
      propertyName,
      index,
      decoratorName: name,
      handle,
      args
    });
  };
}
