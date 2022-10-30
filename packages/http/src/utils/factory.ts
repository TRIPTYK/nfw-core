import type { Middleware } from '@koa/router';

import type { MiddlewareInterface } from '../interfaces/middleware.js';
import isClass from 'is-class';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { container } from '@triptyk/nfw-core';

/**
 * Resolve middleware, can handle 'classic middlewares' and 'NFW middlewares'
 */
export function resolveMiddleware (middleware: Middleware | Class<MiddlewareInterface>) {
  if (!isClass(middleware)) {
    return middleware;
  }
  const instance = container.resolve(middleware);
  return instance.use.bind(instance);
}

export function middlewaresForTarget (target: Class<unknown>, propertyName?: string) {
  const endpointMiddlewares = container.resolve(MetadataStorage).getMiddlewaresForTarget(target, propertyName)
    .map((m) => resolveMiddleware(m.middleware));
  return endpointMiddlewares;
}
