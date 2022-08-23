import type { BaseEntity } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

export abstract class RoleServiceAuthorizer<U extends BaseEntity<U, any>, E extends BaseEntity<E, any>> {
  public declare resourceMeta: ResourceMeta<E>;

  /**
   * Can user read TR in context ?
   */
  abstract read (user: U | undefined, r: E, c: JsonApiContext<any>) : Promise<boolean> | boolean;

  /**
   *
   */
  abstract create (user: U | undefined, r: E, c: JsonApiContext<any>): Promise<boolean> | boolean;

  /**
   *
   */
  abstract update (user: U | undefined, r: E, c: JsonApiContext<any>): Promise<boolean> | boolean;

  /**
   *
   */
  abstract remove (user: U | undefined, r: E, c: JsonApiContext<any>): Promise<boolean> | boolean;
}
