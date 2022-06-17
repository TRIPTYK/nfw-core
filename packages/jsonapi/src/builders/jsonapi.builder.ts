import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import { useErrorHandler, MetadataStorage, HttpBuilder, resolveMiddleware } from '@triptyk/nfw-http';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';

export class JsonApiBuilder extends HttpBuilder {
  async build (): Promise<Router> {
    const resource = JsonApiDatastorage.instance.resources.find((v) => v.target === (this.context.meta.args as Class<AnyEntity>));

    if (!resource) {
      throw new Error(`Resource not found for controller ${(this.context.instance as Function).name}`);
    }

    const controllerRouter = new Router({
      prefix: `/${pluralize(resource.options.entityName)}`
    });

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);
    const jsonApiEndpoints = JsonApiDatastorage.instance.endpoints.filter((e) => e.target === this.context.meta.target.prototype);
    const applyMiddlewares = MetadataStorage.instance.getMiddlewaresForTarget(this.context.meta.target)
      .map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    const errorHandlerMeta = MetadataStorage.instance.getErrorHandlerForTarget(this.context.meta.target);

    console.log(jsonApiEndpoints);

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    for (const endPointMeta of endpointsMeta) {
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    for (const endpoint of jsonApiEndpoints) {
      console.log(endpoint);
    }

    return controllerRouter;
  }
}
