
import { container } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { AnyMiddlewareType } from '../types/any-middleware.js';

export function UseMiddleware (middleware: AnyMiddlewareType) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    container.resolve(MetadataStorage).addMiddlewareUsage({
      target,
      propertyName,
      middleware
    });
  };
}
