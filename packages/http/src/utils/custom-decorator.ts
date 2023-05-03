import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { CustomParams } from '../storages/metadata/use-param.js';

export function createCustomDecorator<T> (handle: CustomParams<T>, name: string, args: unknown[] = []) {
  return function (target: unknown, propertyName: string, index: number) {
    container.resolve(MetadataStorage).addParamUsage({
      target,
      propertyName,
      index,
      decoratorName: name,
      handle: handle as any,
      args
    });
  };
}
