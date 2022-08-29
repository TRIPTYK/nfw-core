import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import type { AnyEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { inject, injectable, container } from '@triptyk/nfw-core';
import { MetadataStorage, HttpBuilder, middlewaresForTarget } from '@triptyk/nfw-http';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';
import type { EndpointMetadataArgs } from '../storage/metadata/endpoint.metadata.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';
import type { ResourceMetadataArgs } from '../storage/metadata/resource.metadata.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { ErrorHandler } from '../errors/error-handler.js';
import type { JsonApiControllerOptions } from '../decorators/jsonapi-controller.decorator.js';
import type { RouteInfo } from './route-map.js';
import { routeMap } from './route-map.js';
import type { ControllerActionParamsMetadataArgs } from '../storage/metadata/controller-params.metadata.js';
import type { ResourceDeserializer } from '../deserializers/resource.deserializer.js';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';
import type { RoleServiceAuthorizer } from '../services/role-authorizer.service.js';
import { NotAcceptableError } from '../errors/not-acceptable.js';
import { UnsupportedMediaTypeError } from '../errors/unsupported-media-type.js';
import { validateContentType } from '../utils/content-type.js';

export interface JsonApiBuilderRouteParams {
  resource: ResourceMeta<any, any>,
  endpoint: EndpointMetadataArgs,
  ctx: RouterContext,
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
  public constructor (@inject(JsonApiRegistry) public registry: JsonApiRegistry) {
    super();
  }

  public async build (): Promise<Router> {
    const [entity, options] = this.context.meta.args as any[];

    const resourceMetadataArgs = JsonApiDatastorage.instance.resources.find((v) => v.target === (entity as Class<AnyEntity>));

    if (!resourceMetadataArgs) {
      throw new Error(`Resource not found for controller ${(this.context.instance as Function).name}`);
    }

    const controllerRouter = new Router({
      prefix: `/${pluralize(resourceMetadataArgs.options.entityName)}`
    });

    const resourceMeta = this.registry.resources.get(resourceMetadataArgs.target)!;

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);
    const jsonApiEndpoints = JsonApiDatastorage.instance.endpoints.filter((e) => e.target === this.context.meta.target.prototype);
    const middlewares = middlewaresForTarget(this.context.meta.target);

    controllerRouter.use(...middlewares);

    /**
     * We patch the entity with defined routes at this moment
     */
    resourceMeta.routes.hasCreate = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.CREATE);
    resourceMeta.routes.hasDelete = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.DELETE);
    resourceMeta.routes.hasGet = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET);
    resourceMeta.routes.hasList = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.LIST);
    resourceMeta.routes.hasRelated = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET_RELATED);
    resourceMeta.routes.hasRelationships = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET_RELATIONSHIPS);
    resourceMeta.routes.hasUpdate = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.UPDATE);

    for (const endPointMeta of endpointsMeta) {
      /**
       * Fall-back to classic HTTP endpoint
       */
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    for (const endpoint of jsonApiEndpoints) {
      this.setupJsonApiEndpoint(controllerRouter, endpoint, resourceMetadataArgs, options);
    }

    return controllerRouter;
  }

  public setupJsonApiEndpoint (router: Router, endpoint: EndpointMetadataArgs, resourceMeta: ResourceMetadataArgs<any>, options: JsonApiControllerOptions) {
    const routeInfo = routeMap[endpoint.method];
    const resource = this.registry.resources.get(resourceMeta.target)!;
    const errorHandlerClass = container.resolve(options.errorHandler ?? ErrorHandler);

    const routeParams = JsonApiDatastorage.instance.getParamsFor(endpoint.target);
    const middlewares = middlewaresForTarget(this.context.meta.target.prototype, endpoint.propertyName);

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
        await errorHandlerClass.handle(e, ctx);
      }
    }, ...middlewares, async (ctx: RouterContext) => {
      /**
     * Validate content type negociation
     */
      if (!validateContentType(ctx.headers['content-type'] ?? '', endpoint.options?.allowedContentType, endpoint.options?.ignoreMedia)) {
        throw new UnsupportedMediaTypeError();
      }
      if (ctx.headers.accept !== 'application/vnd.api+json') {
        throw new NotAcceptableError();
      }

      /** Call each routes */
      const response = await routeInfo.function.call(this.context, {
        resource,
        endpoint,
        routeInfo,
        routeParams,
        options,
        serializer,
        deserializer,
        ctx,
        service,
        authorizer
      });

      ctx.body = response;
      ctx.status = routeInfo.defaultStatus;
      ctx.type = 'application/vnd.api+json';
    });
  }
}
