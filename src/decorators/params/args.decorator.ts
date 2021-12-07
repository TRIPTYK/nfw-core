import { MetadataStorage } from '../../storages/metadata-storage.js'

/**
 * A guard or response-handler arguments, will not work on controller action
 */
export function Args (this: unknown) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: 'args',
      decoratorName: 'args', // args will never be shared or cached, i just don't want Typescript to be angry at me,
      args: [],
      cache: false
    });
  }
}
