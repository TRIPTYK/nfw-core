import type { RouterContext } from '@koa/router';
import type { RouteMetadataArgs } from '@triptyk/nfw-core';
import { container } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';
import type { Next } from 'koa';
import type { ControllerContextInterface } from '../interfaces/controller-context.interface.js';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.interface.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.metadata.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.metadata.js';
import { applyParam } from '../utils/factory.util.js';

const resolveGuardInstance = (guardMeta: UseGuardMetadataArgs) => {
  const paramsForGuardMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === guardMeta.guard).sort((a, b) => a.index - b.index).map((useParam) => ({
    metadata: useParam
  }));
  return {
    instance: container.resolve(guardMeta.guard),
    args: guardMeta.args,
    paramsMeta: paramsForGuardMetadata
  }
}

async function resolveParam (e: {
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

export function handleHttpRouteControllerAction (controllerInstance: any, controllerMetadata: RouteMetadataArgs<unknown>, routeMetadata: HttpEndpointMetadataArgs) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;
  const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controllerMetadata.target && paramMeta.propertyName === routeMetadata.propertyName).sort((a, b) => a.index - b.index).map((useParam) => {
    return ({
      metadata: useParam
    })
  });

  const responsehandlerForRouteMetadata = MetadataStorage.instance.useResponseHandlers.find((respHandlerMetadata) => {
    /**
       * If on controller level
       */
    if (respHandlerMetadata.propertyName === undefined) {
      return respHandlerMetadata.target === controllerMetadata.target;
    }
    /**
       * If on controller action level
       */
    return respHandlerMetadata.target.constructor === controllerMetadata.target && respHandlerMetadata.propertyName === routeMetadata.propertyName;
  });

  const guardForRouteMetadata = MetadataStorage.instance.useGuards.filter((guardMeta) => {
    /**
       * If on controller level
       */
    if (guardMeta.propertyName === undefined) {
      return guardMeta.target === controllerMetadata.target;
    }
    /**
       * If on controller action level
       */
    return guardMeta.target.constructor === controllerMetadata.target && guardMeta.propertyName === routeMetadata.propertyName;
  }).reverse(); // reverse guards because route-level are pushed first

  /**
     * Pre-fetch guards and response-handlers in order to not resolve every request
     */
  let responseHandlerInstance: ResponseHandlerInterface;
  let responseHandlerUseParams: {
    instance: ResponseHandlerInterface,
    args?: unknown[],
    paramsMeta: {
      metadata: UseParamsMetadataArgs,
    }[],
  };

  if (responsehandlerForRouteMetadata) {
    responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
    const params = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === responsehandlerForRouteMetadata.responseHandler).sort((a, b) => a.index - b.index).map((useParam) => ({
      metadata: useParam
    }));
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    }
  }

  const guardsInstance = guardForRouteMetadata.map(resolveGuardInstance);

  return async (ctx: RouterContext, _next: Next) => {
    /**
       * Guards are executed one at a time
       */
    for (const { instance, args, paramsMeta } of guardsInstance) {
      // We resolve the guards
      const resolvedGuardParams = await Promise.all(paramsMeta.map((paramMeta) => {
        /**
         * If handle function is a string => special decorators
         */
        if (paramMeta.metadata.handle === 'args') {
          return args;
        }
        if (paramMeta.metadata.handle === 'controller-context') {
          return {
            controllerAction: routeMetadata.propertyName,
            controllerInstance
          } as ControllerContextInterface
        }
        return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata);
      }));

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

    /**
     * Apply controller params , should resolve cached middleware
     */
    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => resolveParam(e, controllerInstance, ctx, routeMetadata)));

    /**
     * Call main controller action and apply decorator params
     */
    const controllerActionResult = await controllerMethod.call(controllerInstance, ...resolvedParams);

    /**
       * Handle controller action response
       */
    if (responsehandlerForRouteMetadata) {
      const resolvedHandlerParams = await Promise.all(responseHandlerUseParams.paramsMeta.map((paramMeta) => {
        if (paramMeta.metadata.handle === 'args') {
          return responsehandlerForRouteMetadata.args;
        }
        if (paramMeta.metadata.handle === 'controller-context') {
          return {
            controllerAction: routeMetadata.propertyName,
            controllerInstance
          } as ControllerContextInterface
        }
        return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata)
      }));
      await responseHandlerInstance.handle(controllerActionResult, ...resolvedHandlerParams);
    } else {
      ctx.response.body = controllerActionResult;
    }
  };
}
