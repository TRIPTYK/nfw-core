import { MetadataStorage } from '../storages/metadata-storage.js'
import type { RouteBuilderInterface } from '../storages/metadata/route.metadata.js'
import type { Class } from '../types/class.js'

export function Route (builder: Class<RouteBuilderInterface>, controllers: Class<unknown>[]) {
  return function <TC extends Class<unknown>> (target: TC) {
    MetadataStorage.instance.routes.push({
      target,
      builder,
      controllers,
      args: undefined
    })
  }
}
