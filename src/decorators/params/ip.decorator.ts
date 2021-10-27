import { MetadataStorage } from '../../storages/metadata-storage.js'

export function Ip () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      args: [],
      propertyName: propertyKey,
      index,
      handle: (context) => {
        return context.ip;
      }
    });
  }
}
