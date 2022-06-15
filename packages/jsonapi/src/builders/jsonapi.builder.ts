import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { BuilderControllerParams, Class } from '@triptyk/nfw-core';
import { resolveMiddleware, useErrorHandler, BaseBuilder } from '@triptyk/nfw-core';
import pluralize from 'pluralize';
import { MetadataStorage } from '../storage/metadata-storage.js';

export class JsonApiBuilder extends BaseBuilder {
  public async buildRouter ({ errorHandler, controllerMiddlewares }: BuilderControllerParams) {
    const resource = MetadataStorage.instance.resources.find((v) => v.target === (this.context.args[0] as Class<AnyEntity>));

    if (!resource) {
      throw new Error(`Resource not found for controller ${(this.context.controllerInstance as Function).name}`);
    }

    const router = new Router({ ...this.context.controllerMetadata.routing, prefix: `/${pluralize(resource.options.entityName)}` });
    const middlewaresForRouteResolved = controllerMiddlewares.map((m) => resolveMiddleware(m.middleware));

    if (errorHandler) {
      middlewaresForRouteResolved.unshift(useErrorHandler(errorHandler.errorHandler));
    }

    router.use(...middlewaresForRouteResolved);

    return router;
  }
}
