import { injectable } from 'tsyringe'
import { MetadataStorage } from '../storages/metadata-storage.js'
import type { Class } from '../types/class.js'

export interface ControllerDecoratorOptions {
  controllers?: Class<unknown>[],
  routing?: {
    prefix?: string,
    sensitive? : boolean,
    strict?: boolean,
  },
}

export function Controller (options?: ControllerDecoratorOptions) {
  return function <TC extends Class<unknown>> (target: TC) {
    // register as injectable
    injectable()(target);
    MetadataStorage.instance.controllers.push({
      target,
      routing: options?.routing,
      controllers: options?.controllers
    })
  }
}
