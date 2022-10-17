import type { Class } from 'type-fest';
import { container, injectable, MetadataStorage } from '@triptyk/nfw-core';
import { HttpBuilder } from '../builders/http.builder.js';

interface ControllerOptions {
  routeName: string,
  controllers?: Class<unknown>[],
}

export interface ControllerMetaArgs {
  routeName: string,
}

export function Controller (options:ControllerOptions) {
  return function (target: Class<unknown>) {
    injectable()(target);
    container.resolve(MetadataStorage).routes.push({
      target,
      builder: HttpBuilder,
      controllers: options.controllers ?? [],
      args: {
        routeName: options.routeName
      } as ControllerMetaArgs
    })
  }
}
