import { MetadataStorage } from '../../storage/metadata-storage.js'

export function ServiceResponse () {
  return function (target: any, propertyName: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName,
      index,
      decoratorName: 'service-response'
    })
  }
}
