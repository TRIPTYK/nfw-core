import { singleton } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import type { HttpEndpointMetadataArgs } from './metadata/endpoint.js';
import { numericalSortOnKeyASC } from '../utils/numerical-sort.js';
import type { UseGuardMetadataArgs } from './metadata/use-guard.js';
import type { UseMiddlewareMetadataArgs } from './metadata/use-middleware.js';
import type { UseParamsMetadataArgs } from './metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.js';
import { RouterMetadataNotFoundError } from '../errors/router-metadata-not-found.js';
import type { RouteMetadataArgs } from './metadata/route.js';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';

@singleton()
export class MetadataStorage implements MetadataStorageInterface {
  public routes: RouteMetadataArgs<unknown>[] = [];
  public endpoints: HttpEndpointMetadataArgs[] = [];
  public useMiddlewares: UseMiddlewareMetadataArgs[] = [];
  public useParams: UseParamsMetadataArgs[] = [];
  public useGuards: UseGuardMetadataArgs[] = [];
  public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];

  public addRouter (...routerMeta: RouteMetadataArgs<unknown>[]) {
    this.routes.push(...routerMeta);
  }

  public addParamUsage (...paramMeta: UseParamsMetadataArgs[]) {
    this.useParams.push(...paramMeta);
  }

  public addEndpoint (...endpointMeta: HttpEndpointMetadataArgs[]) {
    this.endpoints.push(...endpointMeta);
  }

  public addMiddlewareUsage (...middlewareMeta: UseMiddlewareMetadataArgs[]) {
    this.useMiddlewares.push(...middlewareMeta);
  }

  public addGuardUsage (...guardMeta: UseGuardMetadataArgs[]) {
    this.useGuards.push(...guardMeta);
  }

  public addResponseHandlerUsage (...responseHandlerMeta: UseResponseHandlerMetadataArgs[]) {
    this.useResponseHandlers.push(...responseHandlerMeta);
  }

  public findRouteForTarget (target: unknown) {
    const route = this.routes.find((controllerMeta) => controllerMeta.target === target);

    if (!route) {
      throw new RouterMetadataNotFoundError();
    }

    return route;
  }

  public sortedParametersForEndpoint (target: unknown, propertyName: string) {
    return this.sortedParametersForTarget(target).filter((paramMeta) => paramMeta.propertyName === propertyName);
  }

  public sortedParametersForTarget (target: unknown) {
    return numericalSortOnKeyASC(
      this.useParams.filter((paramMeta) => paramMeta.target.constructor === target), 'index'
    );
  }

  public getGuardsForEndpoint (target: unknown, propertyName: string) {
    return this.useGuards.filter((guardMeta) => {
      if (guardMeta.propertyName === undefined) {
        return guardMeta.target === target;
      }
      return guardMeta.target.constructor === target && guardMeta.propertyName === propertyName;
    }).reverse();
  }

  public getClosestResponseHandlerForEndpoint (target: unknown, propertyName: string) {
    return this.useResponseHandlers.find((respHandlerMetadata) => {
      if (respHandlerMetadata.propertyName === undefined) {
        return respHandlerMetadata.target === target;
      }
      return respHandlerMetadata.target.constructor === target && respHandlerMetadata.propertyName === propertyName;
    });
  }

  public getMiddlewaresForTarget (target: unknown, propertyName?: string) {
    return this.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target).reverse();
  }

  public getEndpointsForTarget (target: unknown) {
    return this.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === target);
  }
}
