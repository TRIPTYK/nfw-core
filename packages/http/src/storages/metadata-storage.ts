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
  public useParams: UseParamsMetadataArgs<unknown>[] = [];
  public useGuards: UseGuardMetadataArgs[] = [];
  public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];

  public addRouter<T> (...routerMeta: RouteMetadataArgs<T>[]) {
    this.routes.push(...routerMeta);
  }

  public addParamUsage (...paramMeta: UseParamsMetadataArgs<unknown>[]) {
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
    const params = this.sortedParametersForTarget(target).filter((paramMeta) => paramMeta.propertyName === propertyName);
    const maxParamIndex = Math.max(-1,...params.map((p) => p.index)) + 1;
    
    if  (maxParamIndex !== params.length) {
      throw new Error(`A decorator is missing for a parameter in ${(target as InstanceType<any>).prototype.constructor.name}.${propertyName}`);
    }
    return params;
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

  public getBeforeMiddlewaresForTarget (target: unknown, propertyName?: string) {
    return this.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target && middlewareMeta.type === 'before').reverse();
  }

  public getAfterMiddlewaresForTarget (target: unknown, propertyName?: string) {
    return this.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target && middlewareMeta.type === 'after').reverse();
  }

  public getEndpointsForTarget (target: unknown) {
    return this.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === target);
  }
}
