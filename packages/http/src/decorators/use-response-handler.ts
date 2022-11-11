import { container } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function UseResponseHandler (responseHandler: Class<ResponseHandlerInterface>, ...args: unknown[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    container.resolve(MetadataStorage).addResponseHandlerUsage({
      target,
      propertyName,
      responseHandler,
      args
    });
  };
}
