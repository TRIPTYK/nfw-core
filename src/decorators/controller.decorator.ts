import { MetadataStorage } from '../storages/metadata-storage.js'
import type { Class } from '../types/class.js'

export function Controller (routeName: `/${string}`) {
  return function <TC extends Class<unknown>> (target: TC) {
    MetadataStorage.instance.controllers.push({
      target,
      routeName
    })
  }
}
