import type { Class } from 'type-fest';
import { container, injectable } from '@triptyk/nfw-core';
import { DefaultBuilder, DefaultBuilderArgs } from '../builders/default.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

interface ControllerOptions {
  routeName: string,
  controllers?: Class<unknown>[],
}


export function Controller (options: ControllerOptions) {
  return function (target: Class<unknown>) {
    injectable()(target);
    container.resolve(MetadataStorage).addRouter<DefaultBuilderArgs>({
      target,
      builder: DefaultBuilder,
      controllers: options.controllers ?? [],
      args: {
        routeName: options.routeName
      }
    });
  };
}
