import { MetadataStorage } from '../storages/metadata-storage.js'
import type { Class } from '../types/class.js'

export interface ControllerDecoratorOptions {
  controllers?: Class<unknown>[],
  routeName?: `/${string}`,
}

export function Controller (options?: ControllerDecoratorOptions) {
  return function <TC extends Class<unknown>> (target: TC) {
    MetadataStorage.instance.controllers.push({
      target,
      routeName: options?.routeName,
      controllers: options?.controllers
    })
  }
}
