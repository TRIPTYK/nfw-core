import { container } from '@triptyk/nfw-core';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { ResolverInterface } from '../interfaces/resolver.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';
import type { ControllerContext } from '../types/controller-context.js';
import { resolveParams } from '../utils/resolve-params.js';
import { ExecutableResponseHandler } from './executable-response-handler.js';

export class ResponseHandlerResolver implements ResolverInterface {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    public controllerContext: ControllerContext
  ) {}

  public resolve (): ExecutableResponseHandler | undefined {
    const responsehandlerForRouteMetadata = this.metadataStorage.getClosestResponseHandlerForEndpoint(this.controllerContext.controllerInstance.constructor, this.controllerContext.controllerAction);

    if (!responsehandlerForRouteMetadata) {
      return;
    }

    const handles = this.resolveParams(responsehandlerForRouteMetadata);
    const responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
    return new ExecutableResponseHandler(responseHandlerInstance, this.controllerContext, handles);
  }

  private resolveParams (responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs) {
    const paramsMetadata = this.metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.responseHandler);
    return resolveParams(paramsMetadata, this.controllerContext);
  }
}
