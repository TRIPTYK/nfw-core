import type { RouterContext, Middleware } from '@koa/router';
import isClass from 'is-class';
import type { Next } from 'koa';
import { container } from 'tsyringe';
import type { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js';
import type { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import type { Class } from '../types/class.js';

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

export function useErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  const errorHandlerInstance = container.resolve(errorHandler);
  return async (context: RouterContext, next: Next) => {
    try {
      await next();
    } catch (e) {
      await errorHandlerInstance.handle(e, context);
    }
  }
}
