import { Middleware } from 'koa';
import { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { Class } from '../types/class.js';

export function UseMiddleware (middleware: Class<MiddlewareInterface> | Middleware) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useMiddlewares.push({
      target,
      propertyName,
      middleware,
      type: 'classic'
    })
  }
}
