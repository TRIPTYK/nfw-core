import isClass from 'is-class';
import type { Class } from 'type-fest';
import { container } from '@triptyk/nfw-core';
import type { AnyMiddlewareType } from '../types/any-middleware.js';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';

export function resolveMiddlewareInstance (middleware: AnyMiddlewareType) {
  if (!isClass(middleware)) {
    return middleware;
  }
  const instance = container.resolve(middleware);
  return instance.use.bind(instance);
}

export function beforeMiddlewaresInstancesForTarget (metadataStorage: MetadataStorageInterface, target: Class<unknown>, propertyName?: string) {
  return metadataStorage
    .getBeforeMiddlewaresForTarget(target, propertyName)
    .map((m) => resolveMiddlewareInstance(m.middleware));
}

export function afterMiddlewaresInstancesForTarget (metadataStorage: MetadataStorageInterface, target: Class<unknown>, propertyName?: string) {
  return metadataStorage
    .getAfterMiddlewaresForTarget(target, propertyName)
    .map((m) => resolveMiddlewareInstance(m.middleware));
}
