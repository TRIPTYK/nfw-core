import { MetadataStorage } from '../storages/metadata-storage.js';
import { ControllerParamsContext } from '../storages/metadata/use-param.metadata.js';

export function createCustomDecorator (handle: (ctx: ControllerParamsContext) => unknown, name: string) {
  return function (target: unknown, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: name,
      handle
    })
  }
}
