import { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import { Next } from 'koa';
import { container } from 'tsyringe';
import { ResponseHandlerInterface } from '../index.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import { applyParam } from '../utils/factory.util.js';
import { CreateApplicationOptions } from './application.factory.js';

export function handleRouteControllerAction (controllerInstance: any, controllerMetadata: ControllerMetadataArgs, routeMetadata: RouteMetadataArgs, applicationOptions: CreateApplicationOptions) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;
  const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controllerMetadata.target && paramMeta.propertyName === routeMetadata.propertyName).sort((a, b) => a.index - b.index);
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

  if (responsehandlerForRouteMetadata) {
    responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
  }

  const guardsInstance = guardForRouteMetadata.map((guardMeta) => {
    return {
      instance: container.resolve(guardMeta.guard),
      args: guardMeta.args
    }
  });

  if ((applicationOptions.globalGuards ?? []).length) {
    const resolvedGlobalGuards = (applicationOptions.globalGuards ?? []).map((e) => {
      return {
        instance: container.resolve(e.guard),
        args: e.args
      }
    });
      /**
       * Add global guards before other guards
       */
    guardsInstance.unshift(...resolvedGlobalGuards);
  }

  return async (ctx: RouterContext, _next: Next) => {
    /**
       * Guards are executed one at a time
       */
    for (const { instance, args } of guardsInstance) {
      const guardResponse = await instance.can({
        controllerAction: routeMetadata.propertyName,
        controllerInstance,
        ctx,
        args
      });
      if (!guardResponse) {
        ctx.response.status = 403;
        throw createHttpError(403);
      }
    }

    const resolvedParams = await Promise.all(paramsForRouteMetadata.map(async (e) => applyParam(e, {
      controllerAction: routeMetadata.propertyName,
      controllerInstance,
      ctx
    })));

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
