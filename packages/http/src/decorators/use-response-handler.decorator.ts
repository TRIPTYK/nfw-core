import type { Class } from '@triptyk/nfw-core';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.interface.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function UseResponseHandler (responseHandler: Class<ResponseHandlerInterface>, ...args: unknown[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useResponseHandlers.push({
      target,
      propertyName,
      responseHandler,
      args
    })
  }
}
