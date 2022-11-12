import { container } from '@triptyk/nfw-core';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';

export class ResponseHandlerResolver {
  public constructor (
        public metadataStorage: MetadataStorageInterface
  ) {}

  public resolve (responseHandlerUsageMeta: UseResponseHandlerMetadataArgs) {
    const paramsForGuardMetadata = this.metadataStorage.sortedParametersForTarget(responseHandlerUsageMeta.responseHandler);

    return {
      instance: container.resolve(responseHandlerUsageMeta.responseHandler),
      args: responseHandlerUsageMeta.args,
      paramsMeta: paramsForGuardMetadata
    };
  }
}
