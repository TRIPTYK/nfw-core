import type { Middleware } from '@koa/router';
import isClass from 'is-class';
import { container } from 'tsyringe';
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
