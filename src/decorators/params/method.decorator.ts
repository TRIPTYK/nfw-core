import { MetadataStorage } from '../../storages/metadata-storage.js'

export function Method () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      args: [],
      handle: (context) => {
        return context.ctx.method;
      }
    });
  }
}
