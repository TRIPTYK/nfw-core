import { ResponseHandlerInterface } from '../interfaces/response-handler.interface.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { Class } from '../types/class.js';

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
