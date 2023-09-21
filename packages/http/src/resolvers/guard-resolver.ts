import { container } from '@triptyk/nfw-core';
import 'reflect-metadata';
import { ExecutableGuard } from '../executables/executable-guard.js';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { ResolverInterface } from '../interfaces/resolver.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { ControllerContextType } from '../types/controller-context.js';
import { resolveParams } from '../utils/resolve-params.js';

export class GuardResolver implements ResolverInterface {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    public controllerContext: ControllerContextType,
  ) {}

  public resolve (): ExecutableGuard[] {
    const guardUsageMetas = this.metadataStorage.getGuardsForEndpoint(this.controllerContext.controllerInstance.constructor, this.controllerContext.controllerAction);
    return guardUsageMetas.map((guardUsageMeta) => this.resolveOneGuard(guardUsageMeta));
  }

  private resolveOneGuard (guardUsageMeta: UseGuardMetadataArgs) {
    const paramsForGuardMetadata = this.metadataStorage.sortedParametersForTarget(guardUsageMeta.guard);
    const handles = resolveParams(paramsForGuardMetadata, this.controllerContext);
    const guardInstance = container.resolve(guardUsageMeta.guard);
    return new ExecutableGuard(guardInstance, this.controllerContext, handles);
  }
}
