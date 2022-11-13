import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import type { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { ControllerContext } from '../types/controller-context.js';
import { executeParams } from '../utils/execute-params.js';
import { resolveParams } from '../utils/resolve-params.js';
import type { ExecutableGuard } from './executable-guard.js';
import type { ExecutableResponseHandler } from './executable-response-handler.js';
import { GuardResolver } from './guard-resolver.js';
import { ResponseHandlerResolver } from './response-handler-resolver.js';

async function executeGuards (guardsInstance: ExecutableGuard[], ctx: RouterContext) {
  for (const guard of guardsInstance) {
    await guard.execute(ctx);
  }
}

export class ControllerActionBuilder {
  private guardResolver: GuardResolver;
  private responseHandlerResolver: ResponseHandlerResolver;

  public constructor (
    public context: ControllerContext<any>,
    public metadataStorage: MetadataStorage
  ) {
    this.guardResolver = new GuardResolver(this.metadataStorage, this.context);
    this.responseHandlerResolver = new ResponseHandlerResolver(this.metadataStorage, this.context);
  }

  public build () {
    const paramsForRouteMetadata: UseParamsMetadataArgs[] = this.metadataStorage.sortedParametersForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);
    const responsehandlerForRouteMetadata = this.metadataStorage.getClosestResponseHandlerForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);
    const guardsForRouteMetadata = this.metadataStorage.getGuardsForEndpoint(this.context.controllerInstance.constructor, this.context.controllerAction);

    return this.controllerActionMiddleware(
      guardsForRouteMetadata.map((meta) => this.guardResolver.resolve(meta)),
      responsehandlerForRouteMetadata
        ? this.responseHandlerResolver.resolve(responsehandlerForRouteMetadata)
        : responsehandlerForRouteMetadata,
      paramsForRouteMetadata
    );
  }

  private controllerActionMiddleware (executableGuards: ExecutableGuard[],
    executableResponseHandler: ExecutableResponseHandler | undefined, paramsForRouteMetadata:UseParamsMetadataArgs[]) {
    const controllerMethod = (this.context.controllerInstance as any)[this.context.controllerAction] as Function;

    return async (ctx: RouterContext, _next: Next) => {
      await executeGuards(executableGuards, ctx);

      const controllerActionResult = await this.executeControllerAction(ctx, paramsForRouteMetadata, controllerMethod);

      if (executableResponseHandler) {
        return executableResponseHandler.execute(controllerActionResult, ctx);
      }

      ctx.response.body = controllerActionResult;
    };
  }

  private async executeControllerAction (ctx: RouterContext, paramsForRouteMetadata: UseParamsMetadataArgs[], controllerMethod: Function) {
    const resolvedParams = await executeParams(resolveParams(paramsForRouteMetadata, this.context), ctx);

    return controllerMethod.call(this.context.controllerInstance, ...resolvedParams);
  }
}
