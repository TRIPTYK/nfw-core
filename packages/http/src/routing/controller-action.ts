import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import type { Next } from 'koa';
import { ForbiddenError } from '../errors/forbidden.js';
import type { GuardInterface } from '../interfaces/guard.js';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import type { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';
import { ParamResolver } from './param-resolver.js';

export interface ResponseHandlerInstanceMeta {
  instance: ResponseHandlerInterface,
  args: unknown[],
  paramsMeta: UseParamsMetadataArgs[],
}

export interface GuardInstanceMeta {
  instance: GuardInterface,
  args: unknown[],
  paramsMeta: UseParamsMetadataArgs[],
}

export async function callGuardWithParams (instance: GuardInterface, resolvedGuardParams: unknown[]) {
  const guardRes = await instance.can(...resolvedGuardParams);
  if (guardRes !== true) {
    throw new ForbiddenError();
  }
}

export class ControllerActionBuilder {
  public constructor (
    public controllerInstance: InstanceType<any>,
    public metadataStorage: MetadataStorage,
    public propertyName: string
  ) {}

  public build () {
    const paramsForRouteMetadata: UseParamsMetadataArgs[] = this.metadataStorage.sortedParametersForEndpoint(this.controllerInstance.constructor, this.propertyName);
    const responsehandlerForRouteMetadata = this.metadataStorage.getClosestResponseHandlerForEndpoint(this.controllerInstance.constructor, this.propertyName);
    const guardsForRouteMetadata = this.metadataStorage.getGuardsForEndpoint(this.controllerInstance.constructor, this.propertyName);

    const responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined = this.getReponseHandlerInstanceMeta(responsehandlerForRouteMetadata);

    const guardsInstance = guardsForRouteMetadata.map(this.resolveGuardInstance.bind(this));

    return this.controllerActionMiddleware(guardsInstance, paramsForRouteMetadata, responseHandlerUseParams);
  }

  private getReponseHandlerInstanceMeta (responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs | undefined) {
    let responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined;

    if (responsehandlerForRouteMetadata) {
      responseHandlerUseParams = this.resolveResponseHandler(responsehandlerForRouteMetadata, responseHandlerUseParams);
    }
    return responseHandlerUseParams;
  }

  private resolveGuardInstance (guardMeta: UseGuardMetadataArgs): GuardInstanceMeta {
    const paramsForGuardMetadata = this.metadataStorage.sortedParametersForTarget(guardMeta.guard);

    return {
      instance: container.resolve(guardMeta.guard),
      args: guardMeta.args,
      paramsMeta: paramsForGuardMetadata
    };
  };

  private resolveResponseHandler (responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs, responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
    const params = this.metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.target);
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    };
    return responseHandlerUseParams;
  }

  private controllerActionMiddleware (guardsInstance: GuardInstanceMeta[], paramsForRouteMetadata:UseParamsMetadataArgs[], responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
    const controllerMethod = (this.controllerInstance as any)[this.propertyName] as Function;

    return async (ctx: RouterContext, _next: Next) => {
      await this.executeGuards(guardsInstance, ctx);

      const controllerActionResult = await this.executeControllerAction(paramsForRouteMetadata, ctx, controllerMethod);

      if (responseHandlerUseParams) {
        return this.executeResponseHandler(responseHandlerUseParams, ctx, controllerActionResult);
      }

      ctx.response.body = controllerActionResult;
    };
  }

  private async executeControllerAction (paramsForRouteMetadata: UseParamsMetadataArgs[], ctx: RouterContext, controllerMethod: Function) {
    const resolvedParams = await this.resolveParams(paramsForRouteMetadata, [], ctx);

    return controllerMethod.call(this.controllerInstance, ...resolvedParams);
  }

  private async executeGuards (guardsInstance: GuardInstanceMeta[], ctx: RouterContext) {
    for (const { instance, args, paramsMeta } of guardsInstance) {
      const resolvedGuardParams = await this.resolveParams(paramsMeta, args, ctx);
      await callGuardWithParams(instance, resolvedGuardParams);
    }
  }

  private async executeResponseHandler (responseHandlerUseParams: ResponseHandlerInstanceMeta, ctx: RouterContext, controllerActionResult: any) {
    const resolvedHandlerParams = await this.resolveParams(responseHandlerUseParams.paramsMeta, responseHandlerUseParams.args, ctx);
    return responseHandlerUseParams.instance.handle(controllerActionResult, ...resolvedHandlerParams);
  }

  private resolveParams (paramsMeta: UseParamsMetadataArgs[], contextArgs: unknown[], ctx: RouterContext) {
    return Promise.all(paramsMeta.map((paramMeta) => new ParamResolver(paramMeta, this.propertyName, this.controllerInstance).handleParam(contextArgs, ctx)));
  }
}
