import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import { AnyEntity } from '@mikro-orm/core';
import type { MikroORM, EntityRepository } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import { inject, injectable, container } from '@triptyk/nfw-core';
import { useErrorHandler, MetadataStorage, HttpBuilder, resolveMiddleware, HttpMethod } from '@triptyk/nfw-http';
import { databaseInjectionToken } from '@triptyk/nfw-mikro-orm';
import pluralize from 'pluralize';
import { JsonApiRepository } from '../repository/jsonapi.repository.js';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';
import type { EndpointMetadataArgs } from '../storage/metadata/endpoint.metadata.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';
import type { ResourceMetadataArgs } from '../storage/metadata/resource.metadata.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { QueryParser } from '../query-parser/query-parser.js';
import { createResourceFrom } from '../utils/create-resource.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import { validateContentType } from '../utils/content-type.js';
import { BadContentTypeError } from '../errors/bad-content-type.js';

export const routeMap: Record<JsonApiMethod, { routeName: string; method: HttpMethod }> = {
  [JsonApiMethod.GET]: {
    routeName: '/:id',
    method: HttpMethod.GET
  },
  [JsonApiMethod.LIST]: {
    routeName: '/',
    method: HttpMethod.GET
  },
  [JsonApiMethod.CREATE]: {
    routeName: '/',
    method: HttpMethod.POST
  },
  [JsonApiMethod.DELETE]: {
    routeName: '/:id',
    method: HttpMethod.DELETE
  },
  [JsonApiMethod.UPDATE]: {
    routeName: '/:id',
    method: HttpMethod.PATCH
  }
}

@injectable()
export class JsonApiBuilder extends HttpBuilder {
  constructor (@inject(JsonApiRegistry) public registry: JsonApiRegistry) {
    super();
  }

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

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    for (const endPointMeta of endpointsMeta) {
      /**
       * Fall-back to classic HTTP endpoint
       */
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    for (const endpoint of jsonApiEndpoints) {
      this.setupJsonApiEndpoint(controllerRouter, endpoint, resource);
    }

    return controllerRouter;
  }

  setupJsonApiEndpoint (router: Router, endpoint: EndpointMetadataArgs, resourceMeta: ResourceMetadataArgs) {
    const routeInfo = routeMap[endpoint.method];
    const orm = container.resolve(databaseInjectionToken) as MikroORM;
    const repository = orm.em.getRepository(resourceMeta.options.entity) as EntityRepository<AnyEntity>;

    if (!(repository instanceof JsonApiRepository<AnyEntity>)) {
      throw new Error('Please inherit your repository with JsonApiRepository');
    }

    const resource = this.registry.resources.get(resourceMeta.target)!;

    router[routeInfo.method](routeInfo.routeName, async (ctx: RouterContext) => {
      try {
        const jsonApiContext = {
          resource,
          koaContext: ctx
        } as JsonApiContext<unknown>;
        if (!validateContentType(ctx.headers['content-type'] ?? '')) {
          throw new BadContentTypeError('Bad content type');
        }
        if (ctx.headers['content-type'] !== ctx.header.accept) {
          throw new BadContentTypeError('Bad content type');
        }
        const query = ctx.query as Record<string, any>;
        const parser = new QueryParser(query);
        parser.context = jsonApiContext;
        const all = await repository.jsonApiList(parser, jsonApiContext);
        const asResource = all.map(e => createResourceFrom(e.toJSON(), resource));
        const serialized = resource.serializer.serialize(asResource);
        ctx.body = serialized;
        ctx.type = 'application/vnd.api+json';
      } catch (e: any) {
        ctx.body = e.message;
        ctx.status = e.status;
      }
    });
  }
}
