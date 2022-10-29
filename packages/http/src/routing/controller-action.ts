import type { RouterContext } from '@koa/router';
import type { RouteMetadataArgs } from '@triptyk/nfw-core';
import { container } from '@triptyk/nfw-core';
import type { Next } from 'koa';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.metadata.js';
import { applyParam } from '../utils/factory.js';
import type { GuardInstance } from './guard-action.js';
import { isSpecialHandle, resolveSpecialContext, resolveGuardParam, callGuardWithParams, resolveGuardInstance } from './guard-action.js';

export interface ParamsMeta {
  metadata: UseParamsMetadataArgs,
}

interface ResponseHandlerInstanceMeta {
  instance: ResponseHandlerInterface,
  args: unknown[],
  paramsMeta: ParamsMeta[],
}

export async function resolveParam (e: {
  metadata: UseParamsMetadataArgs,
}, controllerInstance: any, ctx: RouterContext, endpointMetadata: HttpEndpointMetadataArgs) {
  /**
   * Apply guard params
   */
  const paramResult = await applyParam(e.metadata, {
    controllerAction: endpointMetadata.propertyName,
    controllerInstance,
    ctx
  });

  return paramResult;
}

function controllerActionMiddleware (guardsInstance: GuardInstance[], controllerInstance: any, routeMetadata: HttpEndpointMetadataArgs, paramsForRouteMetadata:ParamsMeta[], responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs | undefined, responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;

  return async (ctx: RouterContext, _next: Next) => {
    for (const { instance, args, paramsMeta } of guardsInstance) {
      const resolvedGuardParams = await Promise.all(paramsMeta.map((paramMeta) => resolveGuardParam(paramMeta, args, routeMetadata, controllerInstance, ctx)));

      await callGuardWithParams(instance, resolvedGuardParams);
    }

    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => resolveParam(e, controllerInstance, ctx, routeMetadata)));

    const controllerActionResult = await controllerMethod.call(controllerInstance, ...resolvedParams);

    if (responsehandlerForRouteMetadata) {
      const resolvedHandlerParams = await Promise.all(responseHandlerUseParams!.paramsMeta.map((paramMeta) => {
        if (isSpecialHandle(paramMeta.metadata.handle)) {
          return resolveSpecialContext(paramMeta, responsehandlerForRouteMetadata.args, routeMetadata, controllerInstance);
        }
        return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata)
      }));
      return responseHandlerUseParams!.instance.handle(controllerActionResult, ...resolvedHandlerParams);
    }

    ctx.response.body = controllerActionResult;
  };
}

export function handleHttpRouteControllerAction (controllerInstance: any, controllerMetadata: RouteMetadataArgs<unknown>, routeMetadata: HttpEndpointMetadataArgs) {
  const metadataStorage = container.resolve(MetadataStorage);

  const paramsForRouteMetadata: ParamsMeta[] = metadataStorage.sortedParametersForEndpoint(controllerMetadata.target, routeMetadata.propertyName).map((useParam) => {
    return ({
      metadata: useParam
    })
  });

  const responsehandlerForRouteMetadata = metadataStorage.getClosestResponseHandlerForEndpoint(controllerMetadata.target, routeMetadata.propertyName);

  const guardsForRouteMetadata = metadataStorage.getGuardsForEndpoint(controllerMetadata.target, routeMetadata.propertyName);

  let responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined;

  if (responsehandlerForRouteMetadata) {
    const params = metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.target).map((useParam) => ({
      metadata: useParam
    }));
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    }
  }

  const guardsInstance = guardsForRouteMetadata.map(resolveGuardInstance);

  return controllerActionMiddleware(guardsInstance, controllerInstance, routeMetadata, paramsForRouteMetadata, responsehandlerForRouteMetadata, responseHandlerUseParams);
}
