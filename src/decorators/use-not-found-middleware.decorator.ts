import { Middleware } from '@koa/router';
import { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { Class } from '../types/class.js';

export function UseNotFoundMiddleware (middleware: Class<MiddlewareInterface> | Middleware) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useMiddlewares.push({
      target,
      propertyName,
      middleware,
      type: 'not-found'
    })
  }
}
