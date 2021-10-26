import { MetadataStorage } from '../../storages/metadata-storage.js'

export function QueryParam (paramName: string) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (ctx, [paramName]: [string]) => {
        return ctx.query[paramName];
      },
      args: [paramName]
    });
  }
}
