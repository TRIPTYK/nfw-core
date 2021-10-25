import { MetadataStorage } from '../../storage/metadata-storage.js'

export function Param (paramName: string) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (ctx, [paramName]: [string]) => {
        return ctx.params[paramName];
      },
      args: [paramName]
    });
  }
}
