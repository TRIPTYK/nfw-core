import { ControllerMetadataArgs } from './metadata/controller.js';
import { RouteMetadataArgs } from './metadata/route.js';
import { UseGuardMetadataArgs } from './metadata/use-guard.js';
import { UseMiddlewareMetadataArgs } from './metadata/use-middleware.js';
import { UseParamsMetadataArgs } from './metadata/use-params.js';
import { UseResponseHandlerMetadataArgs } from './metadata/use-response-handler.js';

export class MetadataStorage {
    /**
     * Singleton
     */
    private static _instance: MetadataStorage;

    public static get instance () {
      if (MetadataStorage._instance) {
        return MetadataStorage._instance;
      }
      return MetadataStorage._instance = new MetadataStorage();
    }

    /**
     * ==================
     * Metadatas storage
     * ==================
    */

    /**
     * Controllers decorator metadata
     */
    public controllers : ControllerMetadataArgs[] = [];

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
}
