import type { RouterContext } from '@koa/router';
import type { RouteMetadataArgs } from '@triptyk/nfw-core';
import { container } from '@triptyk/nfw-core';
import type { Next } from 'koa';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.metadata.js';
import type { GuardInstance } from './guard-action.js';
import { isSpecialHandle, resolveSpecialContext, callGuardWithParams, resolveGuardInstance } from './guard-action.js';

interface ResponseHandlerInstanceMeta {
  instance: ResponseHandlerInterface,
  args: unknown[],
  paramsMeta: UseParamsMetadataArgs[],
}

export function handleParam (paramMeta: UseParamsMetadataArgs, contextArgs: unknown[], controllerAction: string, controllerInstance: unknown, ctx: RouterContext) {
  if (isSpecialHandle(paramMeta.handle)) {
    return resolveSpecialContext(paramMeta, contextArgs, controllerAction, controllerInstance);
  }
  return (paramMeta.handle as ParamsHandleFunction)({
    controllerInstance,
    controllerAction,
    ctx,
    args: contextArgs
  });
}

export function resolveParams (paramsMeta: UseParamsMetadataArgs[], contextArgs: unknown[], controllerAction: string, controllerInstance: any, ctx: RouterContext) {
  return Promise.all(paramsMeta.map((paramMeta) => handleParam(paramMeta, contextArgs, controllerAction, controllerInstance, ctx)));
}

function controllerActionMiddleware (guardsInstance: GuardInstance[], controllerInstance: any, routeMetadata: HttpEndpointMetadataArgs, paramsForRouteMetadata:UseParamsMetadataArgs[], responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs | undefined, responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;

  return async (ctx: RouterContext, _next: Next) => {
    for (const { instance, args, paramsMeta } of guardsInstance) {
      const resolvedGuardParams = await resolveParams(paramsMeta, args, routeMetadata.propertyName, controllerInstance, ctx);
      await callGuardWithParams(instance, resolvedGuardParams);
    }

    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => handleParam(e, [], routeMetadata.propertyName, controllerInstance, ctx)));

    const controllerActionResult = await controllerMethod.call(controllerInstance, ...resolvedParams);

    if (responsehandlerForRouteMetadata) {
      const resolvedHandlerParams = await resolveParams(responseHandlerUseParams!.paramsMeta, responseHandlerUseParams!.args, routeMetadata.propertyName, controllerInstance, ctx);
      return responseHandlerUseParams!.instance.handle(controllerActionResult, ...resolvedHandlerParams);
    }

    ctx.response.body = controllerActionResult;
  };
}

export function handleHttpRouteControllerAction (controllerInstance: any, controllerMetadata: RouteMetadataArgs<unknown>, routeMetadata: HttpEndpointMetadataArgs) {
  const metadataStorage = container.resolve(MetadataStorage);

  const paramsForRouteMetadata: UseParamsMetadataArgs[] = metadataStorage.sortedParametersForEndpoint(controllerMetadata.target, routeMetadata.propertyName);

  const responsehandlerForRouteMetadata = metadataStorage.getClosestResponseHandlerForEndpoint(controllerMetadata.target, routeMetadata.propertyName);

  const guardsForRouteMetadata = metadataStorage.getGuardsForEndpoint(controllerMetadata.target, routeMetadata.propertyName);

  let responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined;

  if (responsehandlerForRouteMetadata) {
    const params = metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.target);
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    }
  }

  const guardsInstance = guardsForRouteMetadata.map(resolveGuardInstance);

  return controllerActionMiddleware(guardsInstance, controllerInstance, routeMetadata, paramsForRouteMetadata, responsehandlerForRouteMetadata, responseHandlerUseParams);
}
