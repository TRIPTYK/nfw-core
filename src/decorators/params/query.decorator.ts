import { MetadataStorage } from '../../storages/metadata-storage.js'

export function Query () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context) => {
        return context.ctx.query;
      }
    });
  }
}
