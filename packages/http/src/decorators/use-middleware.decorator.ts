
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { AnyMiddleware } from '../types/any-middleware.js';

export function UseMiddleware (middleware: AnyMiddleware) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useMiddlewares.push({
      target,
      propertyName,
      middleware
    })
  }
}
