
import isClass from 'is-class';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { container } from '@triptyk/nfw-core';
import type { AnyMiddlewareType } from '../types/any-middleware.js';

export function resolveMiddlewareInstance (middleware: AnyMiddlewareType) {
  if (!isClass(middleware)) {
    return middleware;
  }
  const instance = container.resolve(middleware);
  return instance.use.bind(instance);
}

export function middlewaresInstancesForTarget (target: Class<unknown>, propertyName?: string) {
  return container.resolve(MetadataStorage)
    .getMiddlewaresForTarget(target, propertyName)
    .map((m) => resolveMiddlewareInstance(m.middleware));
}
