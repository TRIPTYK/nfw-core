import { MetadataStorage } from '../../storages/metadata-storage.js'

export function QueryParam (paramName: string) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context, [paramName]: [string]) => {
        return context.ctx.query[paramName];
      },
      args: [paramName]
    });
  }
}
