import { MetadataStorage } from '../../storages/metadata-storage.js';

export interface IUploaded {
  name: string,
  size: number,
  path: string,
  originalName: string,
  type: string,
}

export function Uploaded (fieldName: string) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context) => {
        return (context.ctx.request as any).files[fieldName];
      }
    });
  };
}
