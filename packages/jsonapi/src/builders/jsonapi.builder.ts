import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { inject, injectable, container } from '@triptyk/nfw-core';
import { MetadataStorage, HttpBuilder, middlewaresForTarget } from '@triptyk/nfw-http';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';
import type { EndpointMetadataArgs } from '../storage/metadata/endpoint.metadata.js';
import type { ResourceMetadataArgs } from '../storage/metadata/resource.metadata.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { ErrorHandler } from '../serializers/error.serializer.js';
import type { JsonApiControllerOptions } from '../decorators/jsonapi-controller.decorator.js';
import type { RouteInfo } from './route-map.js';
import { routeMap } from './route-map.js';
import type { ControllerActionParamsMetadataArgs } from '../storage/metadata/controller-params.metadata.js';
import type { ResourceDeserializer } from '../deserializers/resource.deserializer.js';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';
import type { RoleServiceAuthorizer } from '../services/role-authorizer.service.js';

export interface JsonApiBuilderRouteParams {
  resource: ResourceMeta<any, any>,
  endpoint: EndpointMetadataArgs,
  routeInfo: RouteInfo,
  routeParams: ControllerActionParamsMetadataArgs[],
  options: JsonApiControllerOptions,
  serializer : ResourceSerializer<any>,
  deserializer: ResourceDeserializer<any>,
  service : ResourceService<any>,
  authorizer? : RoleServiceAuthorizer<any, any>,
}

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

    /**
   * Resolve before call, they should be singletons
   */
    const serializer = container.resolve(`serializer:${resource.name}`) as ResourceSerializer<any>;
    const deserializer = container.resolve(`deserializer:${resource.name}`) as ResourceDeserializer<any>;
    const service = container.resolve(`service:${resource.name}`) as ResourceService<any>;
    const authorizer = container.resolve(`authorizer:${resource.name}`) as RoleServiceAuthorizer<any, any> | undefined;

    router[routeInfo.method](routeInfo.routeName, async (ctx, next) => {
      try {
        await next();
      } catch (e: any) {
        await errorSerializer.handle(e, ctx);
      }
    }, ...middlewares, routeInfo.function.call(this.context, {
      resource,
      endpoint,
      routeInfo,
      routeParams,
      options,
      serializer,
      deserializer,
      service,
      authorizer
    }));
  }
}
