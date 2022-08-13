import { MetadataStorage } from '../../storage/metadata-storage.js'

export function Ctx () {
  return function (target: any, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: 'koa-context'
    })
  }
}
