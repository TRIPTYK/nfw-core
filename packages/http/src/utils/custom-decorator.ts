import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ParamsHandleFunction } from '../storages/metadata/use-param.js';

export function createCustomDecorator (handle: ParamsHandleFunction<unknown>, name: string, args: unknown[] = []) {
  return function (target: unknown, propertyName: string, index: number) {
    container.resolve(MetadataStorage).addParamUsage({
      target,
      propertyName,
      index,
      decoratorName: name,
      handle,
      args
    });
  };
}
