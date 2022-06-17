import type { EndpointMetadataArgs } from './metadata/endpoint.metadata.js';
import type { RouteMetadataArgs } from './metadata/route.metadata.js';
import type { UseMiddlewareMetadataArgs } from './metadata/use-middleware.metadata.js';

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
   * Controllers decorator metadata
   */
  public endpoints: EndpointMetadataArgs[] = [];

  /**
   * Controller Routes decorator metadata
   */
  public routes: RouteMetadataArgs<unknown>[] = [];

  /**
   * Controller Routes decorator metadata
   */
  public useMiddleware: UseMiddlewareMetadataArgs[] = [];
}
