import { MetadataStorage } from '../storages/metadata-storage.js';
import { ControllerParamsContext } from '../storages/metadata/use-params.metadata.js';

export function createCustomDecorator (handle: (ctx: ControllerParamsContext) => unknown) {
  return function (target: unknown, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      handle
    })
  }
}
