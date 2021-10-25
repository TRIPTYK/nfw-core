import { MetadataStorage } from '../../storage/metadata-storage.js'

export function Body () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyKey,
      index,
      handle: (context) => {
        return context.body;
      }
    });
  }
}
