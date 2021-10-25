import { RouterContext } from '@koa/router';
import { MetadataStorage } from '../storage/metadata-storage.js';

export function createCustomDecorator (handle: (ctx: RouterContext, args: unknown[]) => unknown, args: unknown[]) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyKey,
      index,
      handle,
      args
    })
  }
}
