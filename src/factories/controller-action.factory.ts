import { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import { Next } from 'koa';
import { container } from 'tsyringe';
import { functionSignature, ResponseHandlerInterface } from '../index.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import { UseParamsMetadataArgs } from '../storages/metadata/use-param.metadata.js';
import { applyParam } from '../utils/factory.util.js';
import { CreateApplicationOptions } from './application.factory.js';

async function resolveParam (e: {
  metadata: UseParamsMetadataArgs,
  signature: string,
}, controllerInstance: any, ctx: RouterContext, routeMetadata: RouteMetadataArgs, args: any | undefined, sharedParams: Record<string, unknown>) {
  if (args && e.metadata.handle === 'args') {
    return args;
  }

  // if param has already been used
  if (sharedParams[e.signature] && e.metadata.cache) {
    console.log('reusing shared param ', e.signature);
    return sharedParams[e.signature];
  }

  /**
   * Apply guard params
   */
  const paramResult = await applyParam(e.metadata, {
    controllerAction: routeMetadata.propertyName,
    controllerInstance,
    ctx
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

  const responsehandlerForRouteMetadata = MetadataStorage.instance.useResponseHandlers.find((guardMeta) => {
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
  });

  /**
     * Pre-fetch gaurds and response-handlers to do not resolve every request
     */
  let responseHandlerInstance: ResponseHandlerInterface;
  let responseHandlerUseParams: any;

  if (responsehandlerForRouteMetadata) {
    responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
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
      const resolvedGuardParams = await Promise.all(paramsMeta.map((e) => resolveParam(e, controllerInstance, ctx, routeMetadata, args, sharedParams)));

      try {
        const guardResponse = await instance.can(...resolvedGuardParams);
        if (!guardResponse) {
          ctx.response.status = 403;
          throw createHttpError(403);
        }
      } catch (e) {
        ctx.response.status = 403;
        throw e;
      }
    }

    /**
     * Apply controller params , should resolve cached middleware
     */
    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => resolveParam(e, controllerInstance, ctx, routeMetadata, undefined, sharedParams)));

    /**
     * Call main controller action and apply decorator params
     */
    const controllerActionResult = await controllerMethod.call(controllerInstance, ...resolvedParams);

    /**
       * Handle controller action response
       */
    if (responsehandlerForRouteMetadata) {
      await responseHandlerInstance.handle(controllerActionResult, {
        controllerAction: routeMetadata.propertyName,
        controllerInstance,
        ctx,
        args: responsehandlerForRouteMetadata.args
      });
    } else {
      ctx.response.body = controllerActionResult;
    }
  };
}
