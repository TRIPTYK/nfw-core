import type { Class } from '@triptyk/nfw-core'
import type { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js'
import { MetadataStorage } from '../storages/metadata-storage.js'

export function UseErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useErrorHandler.push({
      target,
      propertyName,
      errorHandler
    })
  }
}
