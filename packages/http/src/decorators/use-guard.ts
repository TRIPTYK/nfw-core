
import { container } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import type { GuardInterface } from '../interfaces/guard.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function UseGuard (guard: Class<GuardInterface>, ...args: unknown[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    container.resolve(MetadataStorage).addGuardUsage({
      target,
      propertyName,
      guard,
      args
    });
  };
}
