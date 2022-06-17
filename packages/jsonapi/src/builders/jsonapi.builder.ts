import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { Class, UseMiddlewareMetadataArgs } from '@triptyk/nfw-core';
import { resolveMiddleware } from '@triptyk/nfw-core';
import { useErrorHandler, MetadataStorage, HttpBuilder } from '@triptyk/nfw-http';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';

export class JsonApiBuilder extends HttpBuilder {
  async build ({ controllerMiddlewaresMeta }: { controllerMiddlewaresMeta: UseMiddlewareMetadataArgs[] }): Promise<Router> {
    const resource = JsonApiDatastorage.instance.resources.find((v) => v.target === (this.context.meta.args as Class<AnyEntity>));

    if (!resource) {
      throw new Error(`Resource not found for controller ${(this.context.instance as Function).name}`);
    }

    const controllerRouter = new Router({
      prefix: `/${pluralize(resource.options.entityName)}`
    });

    const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === this.context.meta.target);
    const applyMiddlewares = controllerMiddlewaresMeta.map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    return controllerRouter;
  }
}
