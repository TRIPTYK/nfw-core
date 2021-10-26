import { Middleware } from 'koa';
import { MiddlewareInterface } from '../middlewares/middleware.interface.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
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
