import type { Middleware, RouterContext } from '@koa/router';
import type { Next } from 'koa';

import type { ErrorHandlerInterface } from '../interfaces/error-middleware.js';
import type { MiddlewareInterface } from '../interfaces/middleware.js';
import isClass from 'is-class';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { container } from '@triptyk/nfw-core';

export function useErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  const errorHandlerInstance = container.resolve(errorHandler) as ErrorHandlerInterface;
  return async (context: RouterContext, next: Next) => {
    try {
      await next();
    } catch (e) {
      await errorHandlerInstance.handle(e, context);
    }
  }
}

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