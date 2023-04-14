
import { container } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { AnyMiddlewareType } from '../types/any-middleware.js';

export function UseMiddleware (...middlewares: AnyMiddlewareType[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    for (const middleware of middlewares) {
      container.resolve(MetadataStorage).addMiddlewareUsage({
        target,
        propertyName,
        middleware,
        type: 'before'
      });
    }
  };
}

export function AfterMiddleware (...middlewares: AnyMiddlewareType[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    for (const middleware of middlewares) {
      container.resolve(MetadataStorage).addMiddlewareUsage({
        target,
        propertyName,
        middleware,
        type: 'after'
      });
    }
  };
}
