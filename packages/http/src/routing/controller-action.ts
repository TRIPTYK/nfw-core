import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import type { Next } from 'koa';
import { ForbiddenError } from '../errors/forbidden.js';
import type { GuardInterface } from '../interfaces/guard.js';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import type { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';
import type { ControllerContext } from '../types/controller-context.js';
import type { ExecutableGuard } from './executable-guard.js';
import { GuardResolver } from './guard-resolver.js';
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
    public context: ControllerContext<any>,
    public metadataStorage: MetadataStorage
  ) {}

  // eslint-disable-next-line max-statements
  public build () {
    const paramsForRouteMetadata: UseParamsMetadataArgs[] = this.metadataStorage.sortedParametersForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);
    const responsehandlerForRouteMetadata = this.metadataStorage.getClosestResponseHandlerForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);
    const guardsForRouteMetadata = this.metadataStorage.getGuardsForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);

    const responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined = this.getReponseHandlerInstanceMeta(responsehandlerForRouteMetadata);

    const guardResolver = new GuardResolver(this.metadataStorage, this.context);
    const guardsInstance = guardsForRouteMetadata.map((meta) => guardResolver.resolve(meta));

    return this.controllerActionMiddleware(guardsInstance, paramsForRouteMetadata, responseHandlerUseParams);
  }

  private getReponseHandlerInstanceMeta (responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs | undefined) {
    let responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined;

    if (responsehandlerForRouteMetadata) {
      responseHandlerUseParams = this.resolveResponseHandler(responsehandlerForRouteMetadata, responseHandlerUseParams);
    }
    return responseHandlerUseParams;
  }

  private resolveResponseHandler (responsehandlerForRouteMetadata: UseResponseHandlerMetadataArgs, responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
    const params = this.metadataStorage.sortedParametersForTarget(responsehandlerForRouteMetadata.responseHandler);
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    };
    return responseHandlerUseParams;
  }

  private controllerActionMiddleware (guardsInstance: ExecutableGuard[], paramsForRouteMetadata:UseParamsMetadataArgs[], responseHandlerUseParams: ResponseHandlerInstanceMeta | undefined) {
    const controllerMethod = (this.context.controllerInstance as any)[this.context.controllerAction] as Function;

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
    const resolvedParams = await this.resolveParams(paramsForRouteMetadata.map((p) => p.handle), [], ctx);

    return controllerMethod.call(this.context.controllerInstance, ...resolvedParams);
  }

  // eslint-disable-next-line class-methods-use-this
  private async executeGuards (guardsInstance: ExecutableGuard[], ctx: RouterContext) {
    for (const guard of guardsInstance) {
      await guard.execute(ctx);
    }
  }

  private async executeResponseHandler (responseHandlerUseParams: ResponseHandlerInstanceMeta, ctx: RouterContext, controllerActionResult: any) {
    const resolvedHandlerParams = await this.resolveParams(responseHandlerUseParams.paramsMeta.map((p) => p.handle), responseHandlerUseParams.args, ctx);
    return responseHandlerUseParams.instance.handle(controllerActionResult, ...resolvedHandlerParams);
  }

  private resolveParams (handles: UseParamsMetadataArgs['handle'][], contextArgs: unknown[], ctx: RouterContext) {
    return Promise.all(handles.map((handle) => new ParamResolver(handle, this.context).resolve(contextArgs)));
  }
}
