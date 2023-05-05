import type { HttpEndpointMetadataArgs } from '../storages/metadata/endpoint.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';
import type { UseGuardMetadataArgs } from '../storages/metadata/use-guard.js';
import type { UseMiddlewareMetadataArgs } from '../storages/metadata/use-middleware.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../storages/metadata/use-response-handler.js';

export interface MetadataStorageInterface {
    addRouter(...routerMeta: RouteMetadataArgs<unknown>[]): void,
    addParamUsage(...paramMeta: UseParamsMetadataArgs<unknown>[]): void,
    addEndpoint(...endpointMeta: HttpEndpointMetadataArgs[]): void,
    addMiddlewareUsage(...middlewareMeta: UseMiddlewareMetadataArgs[]): void,
    addGuardUsage(...guardMeta: UseGuardMetadataArgs[]): void,
    addResponseHandlerUsage(...responseHandlerMeta: UseResponseHandlerMetadataArgs[]): void,
    findRouteForTarget(target: unknown): RouteMetadataArgs<unknown>,
    sortedParametersForEndpoint(target: unknown, propertyName: string): UseParamsMetadataArgs<unknown>[],
    sortedParametersForTarget(target: unknown): UseParamsMetadataArgs<unknown>[],
    getGuardsForEndpoint(target: unknown, propertyName: string): UseGuardMetadataArgs[],
    getClosestResponseHandlerForEndpoint(target: unknown, propertyName: string): UseResponseHandlerMetadataArgs | undefined,
    getBeforeMiddlewaresForTarget(target: unknown, propertyName?: string): UseMiddlewareMetadataArgs[],
    getAfterMiddlewaresForTarget(target: unknown, propertyName?: string): UseMiddlewareMetadataArgs[],
    getEndpointsForTarget(target: unknown): HttpEndpointMetadataArgs[],
}
