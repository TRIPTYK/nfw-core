import { Middleware } from 'koa';
import { MiddlewareInteface } from '../middlewares/middleware.interface.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { Class } from '../types/class.js';

export function UseNotFoundMiddleware (middleware: Class<MiddlewareInteface> | Middleware) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useMiddlewares.push({
      target,
      propertyName,
      middleware,
      type: 'not-found'
    })
  }
}
