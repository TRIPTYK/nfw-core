import { AnyMiddleware } from '../types/any-middleware.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { Class } from '../types/class.js';

export function UseMiddleware (middleware: AnyMiddleware) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useMiddlewares.push({
      target,
      propertyName,
      middleware
    })
  }
}
