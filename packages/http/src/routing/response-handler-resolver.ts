import { container } from '@triptyk/nfw-core';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';
import type { ControllerContext } from '../types/controller-context.js';
import { resolveParams } from '../utils/resolve-params.js';
import { ExecutableResponseHandler } from './executable-response-handler.js';

export class ResponseHandlerResolver {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    public controllerContext: ControllerContext
  ) {}

  public resolve (responseHandlerUseMeta: UseResponseHandlerMetadataArgs): ExecutableResponseHandler {
    const paramsMetadata = this.metadataStorage.sortedParametersForTarget(responseHandlerUseMeta.responseHandler);
    const handles = resolveParams(paramsMetadata, this.controllerContext);
    const responseHandlerInstance = container.resolve(responseHandlerUseMeta.responseHandler);
    return new ExecutableResponseHandler(responseHandlerInstance, this.controllerContext, handles);
  }
}
