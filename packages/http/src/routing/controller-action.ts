import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import type { Next } from 'koa';
import type { ControllerContextInterface } from '../interfaces/controller-context.js';
import type { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { GuardInstance } from './guard-action.js';
import { callGuardWithParams, resolveGuardInstance } from './guard-action.js';
import { ParamResolver } from './param-resolver.js';
import type { ResponseHandlerInstanceMeta } from './response-handler-action.js';
import { executeResponseHandler } from './response-handler-action.js';

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
    } as ControllerContextInterface;
  }
}

export function resolveParams (paramsMeta: UseParamsMetadataArgs[], contextArgs: unknown[], controllerAction: string, controllerInstance: any, ctx: RouterContext) {
  return Promise.all(paramsMeta.map((paramMeta) => new ParamResolver(paramMeta).handleParam(contextArgs, controllerAction, controllerInstance, ctx)));
}

export class ControllerActionBuilder {
  public constructor (
    public controllerInstance: unknown,
    public metadataStorage: MetadataStorage
  ) {}

  public build (target: unknown, propertyName: string) {
    const paramsForRouteMetadata: UseParamsMetadataArgs[] = this.metadataStorage.sortedParametersForEndpoint(target, propertyName);
    const responsehandlerForRouteMetadata = this.metadataStorage.getClosestResponseHandlerForEndpoint(target, propertyName);
    const guardsForRouteMetadata = this.metadataStorage.getGuardsForEndpoint(target, propertyName);

    let responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined;

    if (responsehandlerForRouteMetadata) {
      const params = this.metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.target);
      responseHandlerUseParams = {
        instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
        args: responsehandlerForRouteMetadata.args,
        paramsMeta: params
      };
    }

    const guardsInstance = guardsForRouteMetadata.map(resolveGuardInstance);

    return this.controllerActionMiddleware(guardsInstance, propertyName, paramsForRouteMetadata, responseHandlerUseParams);
  }

  private controllerActionMiddleware (guardsInstance: GuardInstance[], routeMetadata: string, paramsForRouteMetadata:UseParamsMetadataArgs[], responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
    const controllerMethod = (this.controllerInstance as any)[routeMetadata] as Function;

    return async (ctx: RouterContext, _next: Next) => {
      await this.executeGuards(guardsInstance, routeMetadata, ctx);

      const controllerActionResult = await this.executeControllerAction(paramsForRouteMetadata, routeMetadata, ctx, controllerMethod);

      if (responseHandlerUseParams) {
        return executeResponseHandler(responseHandlerUseParams, routeMetadata, this.controllerInstance, ctx, controllerActionResult);
      }

      ctx.response.body = controllerActionResult;
    };
  }

  private async executeControllerAction (paramsForRouteMetadata: UseParamsMetadataArgs[], propertyName: string, ctx: RouterContext, controllerMethod: Function) {
    const resolvedParams = await resolveParams(paramsForRouteMetadata, [], propertyName, this.controllerInstance, ctx);

    return controllerMethod.call(this.controllerInstance, ...resolvedParams);
  }

  private async executeGuards (guardsInstance: GuardInstance[], propertyName: string, ctx: RouterContext) {
    for (const { instance, args, paramsMeta } of guardsInstance) {
      const resolvedGuardParams = await resolveParams(paramsMeta, args, propertyName, this.controllerInstance, ctx);
      await callGuardWithParams(instance, resolvedGuardParams);
    }
  }
}
