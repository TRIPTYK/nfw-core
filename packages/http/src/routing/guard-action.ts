import { container } from '@triptyk/nfw-core';
import { ForbiddenError } from '../errors/forbidden.js';
import type { ControllerContextInterface } from '../interfaces/controller-context.js';
import type { GuardInterface } from '../interfaces/guard.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';

export interface GuardInstance {
  instance: GuardInterface,
  args: unknown[],
  paramsMeta: UseParamsMetadataArgs[],
}

export function isSpecialHandle (handle: UseParamsMetadataArgs['handle']) {
  return handle === 'args' || handle === 'controller-context';
}

export function resolveSpecialContext (paramMeta: UseParamsMetadataArgs, args: unknown[], controllerAction: string, controllerInstance: unknown) {
  if (paramMeta.handle === 'args') {
    return args;
  }
  if (paramMeta.handle === 'controller-context') {
    return {
      controllerAction,
      controllerInstance
    } as ControllerContextInterface
  }
}

export const resolveGuardInstance = (guardMeta: UseGuardMetadataArgs): GuardInstance => {
  const paramsForGuardMetadata = container.resolve(MetadataStorage).sortedParametersForTarget(guardMeta.guard);

  return {
    instance: container.resolve(guardMeta.guard),
    args: guardMeta.args,
    paramsMeta: paramsForGuardMetadata
  }
}

export async function callGuardWithParams (instance: GuardInterface, resolvedGuardParams: unknown[]) {
  const guardRes = await instance.can(...resolvedGuardParams);
  if (guardRes !== true) {
    throw new ForbiddenError();
  }
}
