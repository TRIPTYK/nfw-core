                                                             import type { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import type { Next } from 'koa';
import { container } from 'tsyringe';
import type { ControllerContextInterface, ResponseHandlerInterface } from '../index.js';
import { functionSignature } from '../index.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.metadata.js';
import { debug } from '../utils/debug.util.js';
import { applyParam } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';

async function resolveParam (e: {
  metadata: UseParamsMetadataArgs,
  signature: string,
}, controllerInstance: any, ctx: RouterContext, routeMetadata: RouteMetadataArgs, sharedParams: Record<string, unknown>) {
  // if param has already been used
  if (sharedParams[e.signature] && e.metadata.cache) {
    debug?.('info', 'reusing shared param ', e.signature);
    return sharedParams[e.signature];
  }

  /**
   * Apply guard params
   */
  const paramResult = await applyParam(e.metadata, {
    controllerAction: routeMetadata.propertyName,
    controllerInstance,
    ctx,
    sharedParams
  });

  sharedParams[e.signature] = paramResult;

  return paramResult;
}

export function handleRouteControllerAction (controllerInstance: any, controllerMetadata: ControllerMetadataArgs, routeMetadata: RouteMetadataArgs, applicationOptions: CreateApplicationOptions) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;
  const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controllerMetadata.target && paramMeta.propertyName === routeMetadata.propertyName).sort((a, b) => a.index - b.index).map((useParam) => {
    return ({
      metadata: useParam,
      signature: functionSignature(useParam.decoratorName, useParam.args)
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
      signature: string,
    }[],
  };

  if (responsehandlerForRouteMetadata) {
    responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
    const params = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === responsehandlerForRouteMetadata.responseHandler).sort((a, b) => a.index - b.index).map((useParam) => ({
      metadata: useParam,
      signature: functionSignature(useParam.decoratorName, useParam.args)
    }));
    responseHandlerUseParams = {
      instance: container.resolve(responsehandlerForRouteMetadata.responseHandler),
      args: responsehandlerForRouteMetadata.args,
      paramsMeta: params
    }
  }

  const guardsInstance = guardForRouteMetadata.map((guardMeta) => {
    const paramsForGuardMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === guardMeta.guard).sort((a, b) => a.index - b.index).map((useParam) => ({
      metadata: useParam,
      signature: functionSignature(useParam.decoratorName, useParam.args)
    }));
    return {
      instance: container.resolve(guardMeta.guard),
      args: guardMeta.args,
      paramsMeta: paramsForGuardMetadata
    }
  });

  /**
   * Apply global guards
   */
  if ((applicationOptions.globalGuards ?? []).length) {
    const resolvedGlobalGuards = (applicationOptions.globalGuards ?? []).map((e) => {
      const paramsForGuardMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === e).sort((a, b) => a.index - b.index).map((useParam) => ({
        metadata: useParam,
        signature: functionSignature(useParam.decoratorName, useParam.args)
      }));

      return {
        instance: container.resolve(e.guard),
        args: e.args,
        paramsMeta: paramsForGuardMetadata
      }
    });
      /**
       * Add global guards before other guards
       */
    guardsInstance.unshift(...resolvedGlobalGuards);
  }

  return async (ctx: RouterContext, _next: Next) => {
    const sharedParams: Record<string, unknown> = {};
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
        return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata, sharedParams);
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
    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => resolveParam(e, controllerInstance, ctx, routeMetadata, sharedParams)));

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
        return resolveParam(paramMeta, controllerInstance, ctx, routeMetadata, sharedParams)
      }));
      resolvedHandlerParams.unshift(controllerActionResult);
      // we need to anonymise the function because we get a Typescript Error ?
      await (responseHandlerInstance.handle as Function)(...resolvedHandlerParams);
    } else {
      ctx.response.body = controllerActionResult;
    }
  };
}
