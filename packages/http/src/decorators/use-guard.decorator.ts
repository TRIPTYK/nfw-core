import type { Class } from '@triptyk/nfw-core'
import type { GuardInterface } from '../interfaces/guard.interface.js'
import { MetadataStorage } from '../storages/metadata-storage.js'

export function UseGuard (guard: Class<GuardInterface>, ...args: unknown[]) {
  return function (target: Class<unknown> | unknown, propertyName?: string) {
    MetadataStorage.instance.useGuards.push({
      target,
      propertyName,
      guard,
      args
    })
  }
}
