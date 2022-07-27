import type { BaseEntity } from '@mikro-orm/core';
import type { ResourceMeta } from '../jsonapi.registry.js';

export class Resource<T extends BaseEntity<T, any>> {
  /**
   * The meta linked with the resource
   */
  declare meta: ResourceMeta<T, this>;
  /**
 * The identifier key will always be 'id' in this framework
 */
  declare id: string;
}
