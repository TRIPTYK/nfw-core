import 'reflect-metadata';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { ResolverInterface } from '../interfaces/resolver.js';
import type { ControllerContext } from '../types/controller-context.js';
import { resolveParams } from '../utils/resolve-params.js';
import { ExecutableControllerAction } from './executable-controller-action.js';

export class ControllerActionResolver implements ResolverInterface {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    public controllerContext: ControllerContext
  ) {}

  public resolve (): ExecutableControllerAction {
    const paramsForRouteMetadata = this.metadataStorage.sortedParametersForEndpoint(this.controllerContext.controllerInstance.constructor, this.controllerContext.controllerAction);
    const handles = resolveParams(paramsForRouteMetadata, this.controllerContext);
    return new ExecutableControllerAction(this.controllerContext, handles);
  }
}
