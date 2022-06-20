import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ControllerParamsContext } from '../storages/metadata/use-param.metadata.js';

/**
 * Register custom decorator for controller
 */
export function createCustomDecorator (handle: (ctx: ControllerParamsContext) => unknown, name: string, args: unknown[] = []) {
  return function (target: unknown, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: name,
      handle,
      args
    })
  }
}
