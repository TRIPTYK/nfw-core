import type { Class } from 'type-fest';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { UseGuardMetadataArgs } from './metadata/use-guard.js';
import type { UseMiddlewareMetadataArgs } from './metadata/use-middleware.js';
import type { UseParamsMetadataArgs } from './metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.metadata.js';

export class MetadataStorage {
  public endpoints: HttpEndpointMetadataArgs[] = [];
  public useMiddlewares: UseMiddlewareMetadataArgs[] = [];
  public useParams: UseParamsMetadataArgs[] = [];
  public useGuards: UseGuardMetadataArgs[] = [];
  public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];

  public sortedParametersFor (target: unknown, propertyName: string) {
    return this.useParams.filter((paramMeta) => paramMeta.target.constructor === target && paramMeta.propertyName === propertyName).sort((a, b) => a.index - b.index)
  }

  public getMiddlewaresForTarget (target: unknown, propertyName?: string) {
    return this.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target).reverse();
  }

  public getEndpointsForTarget (target: unknown) {
    return this.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === target);
  }
}
