import { RouterContext } from '@koa/router';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function createCustomDecorator (handle: (ctx: RouterContext, args: unknown[]) => unknown, args: unknown[]) {
  return function (target: unknown, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      handle,
      args
    })
  }
}
