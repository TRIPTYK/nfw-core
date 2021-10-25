import { ControllerMetadataArgs } from './metadata/controller.js';
import { RouteMetadataArgs } from './metadata/route.js';
import { UseParamsMetadataArgs } from './metadata/use-params.js';

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
     * Metadatas storage
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
}
