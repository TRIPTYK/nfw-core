import { injectable } from 'tsyringe'
import type { BuilderInterface } from '../interfaces/builder.interface.js'
import { MetadataStorage } from '../storages/metadata-storage.js'
import type { Class } from '../types/class.js'

export interface ControllerDecoratorOptions {
  controllers?: Class<unknown>[],
  builder?: Class<BuilderInterface> | {
    args: unknown[],
    builder : Class<BuilderInterface>,
  },
  routing?: {
    prefix?: string,
    sensitive? : boolean,
    strict?: boolean,
  } | string,
}

export function Controller (options: ControllerDecoratorOptions) {
  return function <TC extends Class<unknown>> (target: TC) {
    // register as injectable
    injectable()(target);
    MetadataStorage.instance.controllers.push({
      target,
      builder: typeof options.builder === 'object' ? options.builder.builder : options.builder,
      args: typeof options.builder === 'object' ? options.builder.args : [],
      routing: typeof options?.routing === 'string'
        ? {
            prefix: options.routing
          }
        : options.routing,
      controllers: options.controllers
    })
  }
}
