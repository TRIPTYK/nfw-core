import { MetadataStorage } from '../../storages/metadata-storage.js'

export function Header () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      args: [],
      index,
      handle: (context) => {
        return context.ctx.header;
      }
    });
  }
}
