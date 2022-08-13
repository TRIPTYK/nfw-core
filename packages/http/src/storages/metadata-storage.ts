import type { Class } from '@triptyk/nfw-core';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import type { UseErrorHandlerMetadataArgs } from './metadata/use-error-handler.metadata.js';
import type { UseGuardMetadataArgs } from './metadata/use-guard.metadata.js';
import type { UseMiddlewareMetadataArgs } from './metadata/use-middleware.metadata.js';
import type { UseParamsMetadataArgs } from './metadata/use-param.metadata.js';
import type { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  private static _instance?: MetadataStorage;

  public static get instance () {
    if (MetadataStorage._instance) {
      return MetadataStorage._instance;
    }
    return (MetadataStorage._instance = new MetadataStorage());
  }

  /**
   * Clear the MetadataStorage instance which is often useless after CreateApplication
   */
  public static clear () {
    this._instance = undefined;
  }

  /**
   * ==================
   * Metadatas storage
   * ==================
   */

  public getEndpointsForTarget (target: unknown) {
    return this.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === target);
  }

  /**
   * Use parameters in controller route
   */
  public endpoints: HttpEndpointMetadataArgs[] = [];

  public getMiddlewaresForTarget (target: unknown, propertyName?: string) {
    return this.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target).reverse();
  }

  /**
   * Use parameters in controller route
   */
  public useMiddlewares: UseMiddlewareMetadataArgs[] = [];

  /**
   * Use parameters in controller route
   */
  public useParams: UseParamsMetadataArgs[] = [];

  /**
   * Use guards for controllers/routes
   */
  public useGuards: UseGuardMetadataArgs[] = [];

  /**
   * Use guards for controllers/routes
   */
  public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];

  public getErrorHandlerForTarget (target: unknown, propertyName?: string) {
    return this.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === propertyName && middlewareMeta.target === target);
  }

  /**
   * Error handling
   */
  public useErrorHandler: UseErrorHandlerMetadataArgs[] = [];
}