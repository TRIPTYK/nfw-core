import { MetadataStorage } from '../../storages/metadata-storage.js'

export function Body () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context) => {
        return context.body;
      }
    });
  }
}
