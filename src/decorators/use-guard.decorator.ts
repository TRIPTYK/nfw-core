import { GuardInterface } from '../guards/guard.interface.js'
import { MetadataStorage } from '../storage/metadata-storage.js'
import { Class } from '../types/class.js'

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
