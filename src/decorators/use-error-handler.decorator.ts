import type { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js'
import { MetadataStorage } from '../storages/metadata-storage.js'
import type { Class } from '../types/class.js'

export function UseErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useErrorHandler.push({
      target,
      propertyName,
      errorHandler
    })
  }
}
