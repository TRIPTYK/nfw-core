import type { Class } from '@triptyk/nfw-core';
import { MetadataStorage } from '@triptyk/nfw-core'
import { HttpBuilder } from '../builders/route.builder.js';

interface ControllerOptions {
  routeName: string,
  controllers?: Class<unknown>[],
}

export interface ControllerMetaArgs {
  routeName: string,
}

export function Controller (options:ControllerOptions) {
  return function (target: Class<unknown>) {
    MetadataStorage.instance.routes.push({
      target,
      builder: HttpBuilder,
      controllers: options.controllers ?? [],
      args: {
        routeName: options.routeName
      } as ControllerMetaArgs
    })
  }
}
