import type { AnyEntity } from '@mikro-orm/core';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { Class } from '../types/class.js';

export interface AreaOptions {
  routeName?: `/${string}`,
  controllers : Class<unknown>[]
}

export function Area ({routeName, controllers}: AreaOptions) {
  return function <TC extends Class<unknown>> (target: TC) {
    MetadataStorage.instance.areas.push({
      target,
      routeName,
      controllers
    });
  }
}
