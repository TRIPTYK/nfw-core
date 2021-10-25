import { MetadataStorage } from '../../storage/metadata-storage.js'
import { ParamType } from '../../storage/metadata/use-params.js';

export function Body () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyKey,
      index,
      paramType: ParamType.BODY
    });
  }
}
