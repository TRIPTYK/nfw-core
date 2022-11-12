import { container } from '@triptyk/nfw-core';
import 'reflect-metadata';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { ControllerContext } from '../types/controller-context.js';
import { ExecutableGuard } from './executable-guard.js';
import { ParamResolver } from './param-resolver.js';

export type ResolvedParam = ControllerContext<unknown> | unknown[] | ParamsHandleFunction<any>;

export class GuardResolver {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    public controllerContext: ControllerContext
  ) {}

  public resolve (guardUsageMeta: UseGuardMetadataArgs): ExecutableGuard {
    const paramsForGuardMetadata = this.metadataStorage.sortedParametersForTarget(guardUsageMeta.guard);
    const handles = this.resolveParams(paramsForGuardMetadata);
    const guardInstance = container.resolve(guardUsageMeta.guard);
    return new ExecutableGuard(guardInstance, this.controllerContext, handles);
  }

  private resolveParams (params: UseParamsMetadataArgs[]) {
    return params.map(({ handle, args }) => new ParamResolver(handle, this.controllerContext).resolve(args));
  }
}
