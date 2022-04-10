import type { AreaMetadataArgs } from './metadata/area.metadata.js';
import type { ControllerMetadataArgs } from './metadata/controller.metadata.js';
import type { RouteMetadataArgs } from './metadata/route.metadata.js';
import type { UseErrorHandlerMetadataArgs } from './metadata/use-error-handler.metadata.js';
import type { UseGuardMetadataArgs } from './metadata/use-guard.metadata.js';
import type { UseMiddlewareMetadataArgs } from './metadata/use-middleware.metadata.js';
import type { UseParamsMetadataArgs } from './metadata/use-param.metadata.js';
import type { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  // eslint-disable-next-line no-use-before-define
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

  /**
   * Controllers decorator metadata
  */
  public areas: AreaMetadataArgs[] = [];

  /**
   * Controllers decorator metadata
   */
  public controllers: ControllerMetadataArgs[] = [];

  /**
   * Controller Routes decorator metadata
   */
  public routes: RouteMetadataArgs[] = [];

  /**
   * Use parameters in controller route
   */
  public useParams: UseParamsMetadataArgs[] = [];

  /**
   * Middleware uses for controllers/routes
   */
  public useMiddlewares: UseMiddlewareMetadataArgs[] = [];

  /**
   * Use guards for controllers/routes
   */
  public useGuards: UseGuardMetadataArgs[] = [];

  /**
   * Use guards for controllers/routes
   */
  public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];

  /**
   * Error handling
   */
  public useErrorHandler: UseErrorHandlerMetadataArgs[] = [];
}
