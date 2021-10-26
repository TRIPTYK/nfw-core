import { MetadataStorage } from '../../storage/metadata-storage.js'

export function Header () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context) => {
        return context.header;
      }
    });
  }
}
