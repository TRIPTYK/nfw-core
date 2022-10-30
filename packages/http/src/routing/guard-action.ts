import { container } from '@triptyk/nfw-core';
import { ForbiddenError } from '../errors/forbidden.js';
import type { GuardInterface } from '../interfaces/guard.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';

export interface GuardInstance {
  instance: GuardInterface,
  args: unknown[],
  paramsMeta: UseParamsMetadataArgs[],
}

export const resolveGuardInstance = (guardMeta: UseGuardMetadataArgs): GuardInstance => {
  const paramsForGuardMetadata = container.resolve(MetadataStorage).sortedParametersForTarget(guardMeta.guard);

  return {
    instance: container.resolve(guardMeta.guard),
    args: guardMeta.args,
    paramsMeta: paramsForGuardMetadata
  };
};

export async function callGuardWithParams (instance: GuardInterface, resolvedGuardParams: unknown[]) {
  const guardRes = await instance.can(...resolvedGuardParams);
  if (guardRes !== true) {
    throw new ForbiddenError();
  }
}
