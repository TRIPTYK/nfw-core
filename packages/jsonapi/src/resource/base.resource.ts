import type { ResourceMeta } from '../jsonapi.registry.js';

export type ResourceContext = Record<string, unknown>;

export abstract class Resource<T> {
  /**
   * The meta linked with the resource
   */
  declare meta: ResourceMeta;
  /**
 * The identifier key will always be 'id' in this framework
 */
  declare id: string;
}
