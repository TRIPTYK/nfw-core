import { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js'
import { MetadataStorage } from '../storage/metadata-storage.js'
import { Class } from '../types/class.js'

export function UseErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useErrorHandler.push({
      target,
      propertyName,
      errorHandler
    })
  }
}
