import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import type { BuilderContext, BuilderControllerParams, BuilderInterface, BuilderRouteParams } from '../interfaces/builder.interface.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';

export class BaseBuilder implements BuilderInterface {
  public declare context: BuilderContext;

  public async buildRouter ({ errorHandler, controllerMiddlewares }: BuilderControllerParams) {
    const router = new Router(this.context.controllerMetadata.routing);

    const middlewaresForRouteResolved = controllerMiddlewares.map((m) => resolveMiddleware(m.middleware));

    if (errorHandler) {
      middlewaresForRouteResolved.unshift(useErrorHandler(errorHandler.errorHandler));
    }

    router.use(...middlewaresForRouteResolved);

    return router;
  }

  public async buildEndpoint ({ controllerRouter, routeMetadata, middlewaresForRoute, errorHandlerForRouteMeta } : BuilderRouteParams) {
    const middlewaresResolved = middlewaresForRoute.map((m) => resolveMiddleware(m.middleware));

    if (errorHandlerForRouteMeta) {
      middlewaresResolved.unshift(useErrorHandler(errorHandlerForRouteMeta!.errorHandler));
    }

    const controllerMethod = (this.context.controllerInstance as any)[routeMetadata.propertyName] as Function;

    controllerRouter[routeMetadata.method](routeMetadata.routeName,
      ...middlewaresResolved,
      async (ctx: RouterContext) => {
        const result = await (controllerMethod as Function).call(this.context.controllerInstance, ctx);
        ctx.body = result;
      }
    )
  }
}
