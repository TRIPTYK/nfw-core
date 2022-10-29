import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import type { ControllerContextInterface } from '../interfaces/controller-context.js';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { GuardInterface } from '../interfaces/guard.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { ParamsMeta } from './controller-action.js';
import { resolveParam } from './controller-action.js';

export interface GuardInstance {
  instance: GuardInterface,
  args: unknown[],
  paramsMeta: ParamsMeta[],
}

export function isSpecialHandle (handle: UseParamsMetadataArgs['handle']) {
  return handle === 'args' || handle === 'controller-context';
}

export function resolveSpecialContext (paramMeta: ParamsMeta, args: unknown[], routeMetadata: HttpEndpointMetadataArgs, controllerInstance: unknown) {
  if (paramMeta.metadata.handle === 'args') {
    return args;
  }
  if (paramMeta.metadata.handle === 'controller-context') {
    return {
      controllerAction: routeMetadata.propertyName,
      controllerInstance
    } as ControllerContextInterface
  }
}

export function resolveGuardParam (paramMeta: ParamsMeta, args: unknown[], routeMetadata: HttpEndpointMetadataArgs, controllerInstance: unknown, ctx: RouterContext) {
  if (isSpecialHandle(paramMeta.metadata.handle)) {
    return resolveSpecialContext(paramMeta, args, routeMetadata, controllerInstance);
  }
  return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata);
}

export const resolveGuardInstance = (guardMeta: UseGuardMetadataArgs): GuardInstance => {
  const paramsForGuardMetadata = container.resolve(MetadataStorage).sortedParametersForTarget(guardMeta.guard).map((useParam) => ({
    metadata: useParam
  }));

  return {
    instance: container.resolve(guardMeta.guard),
    args: guardMeta.args,
    paramsMeta: paramsForGuardMetadata
  }
}

export async function callGuardWithParams (instance: GuardInterface, resolvedGuardParams: unknown[]) {
  const guardRes = await instance.can(...resolvedGuardParams);
  if (guardRes !== true) {
    if (typeof instance.code === 'number') {
      if (instance.message === undefined) {
        throw createHttpError(instance.code ?? 403);
      }
      throw createHttpError(instance.code ?? 403, instance.message);
    }
  }
}
