import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { inject, injectable, container } from '@triptyk/nfw-core';
import { MetadataStorage, HttpBuilder, middlewaresForTarget } from '@triptyk/nfw-http';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';
import type { EndpointMetadataArgs } from '../storage/metadata/endpoint.metadata.js';
import type { ResourceMetadataArgs } from '../storage/metadata/resource.metadata.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { ErrorHandler } from '../serializers/error.serializer.js';
import type { JsonApiControllerOptions } from '../decorators/jsonapi-controller.decorator.js';
import { routeMap } from './route-map.js';

@injectable()
export class JsonApiBuilder extends HttpBuilder {
  constructor (@inject(JsonApiRegistry) public registry: JsonApiRegistry) {
    super();
  }

  async build (): Promise<Router> {
    const [entity, options] = this.context.meta.args as any[];

    const resource = JsonApiDatastorage.instance.resources.find((v) => v.target === (entity as Class<AnyEntity>));

    if (!resource) {
      throw new Error(`Resource not found for controller ${(this.context.instance as Function).name}`);
    }

    const controllerRouter = new Router({
      prefix: `/${pluralize(resource.options.entityName)}`
    });

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);
    const jsonApiEndpoints = JsonApiDatastorage.instance.endpoints.filter((e) => e.target === this.context.meta.target.prototype);
    const middlewares = middlewaresForTarget(this.context.meta.target);

    controllerRouter.use(...middlewares);

    for (const endPointMeta of endpointsMeta) {
      /**
       * Fall-back to classic HTTP endpoint
       */
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    for (const endpoint of jsonApiEndpoints) {
      this.setupJsonApiEndpoint(controllerRouter, endpoint, resource, options);
    }

    return controllerRouter;
  }

  setupJsonApiEndpoint (router: Router, endpoint: EndpointMetadataArgs, resourceMeta: ResourceMetadataArgs<any>, options: JsonApiControllerOptions) {
    const routeInfo = routeMap[endpoint.method];
    const resource = this.registry.resources.get(resourceMeta.target)!;
    const errorSerializer = container.resolve(ErrorHandler);

    const routeParams = JsonApiDatastorage.instance.getParamsFor(endpoint.target);
    const middlewares = middlewaresForTarget(this.context.meta.target, endpoint.propertyName);

    router[routeInfo.method](routeInfo.routeName, ...middlewares, async (ctx, next) => {
      try {
        await next();
      } catch (e: any) {
        console.log(e);
        await errorSerializer.handle(e, ctx);
      }
    }, routeInfo.function.call(this.context, resource, endpoint, routeInfo, routeParams, options));
  }
}
