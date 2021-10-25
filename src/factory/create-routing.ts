import Router, { RouterContext } from '@koa/router';
import { Next } from 'koa';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { ControllerMetadataArgs } from '../storage/metadata/controller.js';
import { UseParamsMetadataArgs } from '../storage/metadata/use-params.js';
import { CreateApplicationOptions } from './create-application.js';

export function createRouting (applicationRouter: Router, applicationOptions: CreateApplicationOptions) {
  for (const controller of applicationOptions.controllers) {
    const controllerMetadata = MetadataStorage.instance.controllers.find((cMetadata) => cMetadata.target === controller);
    const controllerRouter = new Router({
      prefix: controllerMetadata.routeName
    });
    createController(controllerMetadata, controllerRouter);
    applicationRouter.use(controllerRouter.routes());
  }
}

/**
 * Handles creating controller-level route
 */
export function createController (controller: ControllerMetadataArgs, controllerRouter: Router) {
  container.registerSingleton(controller.target);
  const controllerInstance = container.resolve(controller.target);
  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controller.target);

  for (const routeMetadata of controllerRoutesMeta) {
    const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controller.target && paramMeta.propertyKey === routeMetadata.propertyKey).sort((a, b) => a.index - b.index);

    const controllerMethod = controllerInstance[routeMetadata.propertyKey] as Function;
    controllerRouter[routeMetadata.method](routeMetadata.routeName, (ctx: RouterContext, next: Next) => {
      controllerMethod.call(controllerInstance, ...paramsForRouteMetadata.map((e) => applyParam(e, ctx)));
    })
  }
}

export function applyParam (paramMetadata: UseParamsMetadataArgs, ctx: RouterContext) {
  return paramMetadata.handle(ctx, paramMetadata.args);
}

/**
 * Handles creating sub-route of controller
 *
 */
export function createRoute (router: Router, controllerMetadata: ControllerMetadataArgs, controllerInstance: unknown) {

}
