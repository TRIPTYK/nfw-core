import { ControllerMetadataArgs } from './metadata/controller.metadata.js';
import { RouteMetadataArgs } from './metadata/route.metadata.js';
import { UseErrorHandlerMetadataArgs } from './metadata/use-error-handler.metadata.js';
import { UseGuardMetadataArgs } from './metadata/use-guard.metadata.js';
import { UseMiddlewareMetadataArgs } from './metadata/use-middleware.metadata.js';
import { UseParamsMetadataArgs } from './metadata/use-param.metadata.js';
import { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  private static _instance: MetadataStorage;

  public static get instance () {
    if (MetadataStorage._instance) {
      return MetadataStorage._instance;
    }
    return (MetadataStorage._instance = new MetadataStorage());
  }

  /**
   * ==================
   * Metadatas storage
   * ==================
   */

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
   * Use parameters in controller route
   */
   public useResponseHandlerParams: UseParamsMetadataArgs[] = [];

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
