/* eslint-disable max-statements */
import type { BaseEntity, EntityDTO, Loaded } from '@mikro-orm/core';
import type { EntityDTOProp } from '@mikro-orm/core/typings.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { LinksObject } from '../serializers/spec.interface.js';

export abstract class Resource<T extends BaseEntity<any, 'id'>> {
  public metaObject?: Record<string, unknown> | undefined;
  public linksObject?: LinksObject<string>;

  /**
   * The meta linked with the resource
   */
  public declare resourceMeta: ResourceMeta<T, this>;
  /**
   * The context in which the resource was created
   */
  public declare context: JsonApiContext<T, this>;
  /**
 * The identifier key will always be 'id' in this framework
 */
  public abstract id?: string;
  /**
   * Transforms the resource to a POJO
   */
  public toPojo () {
    const pojo = {} as Partial<EntityDTO<Loaded<T, never>>>;

    for (const attr of this.resourceMeta.attributes) {
      const valueOfProperty = (this as unknown as T & Partial<T>)[attr.name as keyof T];
      if (valueOfProperty !== undefined) {
        pojo[attr.name as keyof EntityDTO<Loaded<T, never>>] = valueOfProperty as EntityDTOProp<any>;
      }
    }
    for (const attr of this.resourceMeta.relationships) {
      const valueOfProperty = (this as unknown as T & Partial<T>)[attr.name as keyof T];
      if (valueOfProperty === null) {
        // eslint-disable-next-line unicorn/no-null
        pojo[attr.name as keyof EntityDTO<Loaded<T, never>>] = null as any;
        continue;
      }
      if (valueOfProperty !== undefined) {
        if (Array.isArray(valueOfProperty)) {
          if (valueOfProperty.some((v) => !(v instanceof Resource))) {
            throw new Error(`${valueOfProperty} must be instanceof Resource`);
          }
        } else if (!(valueOfProperty instanceof Resource) && valueOfProperty !== null) {
          throw new Error(`${valueOfProperty} must be instanceof Resource or null`);
        }
        const transformedValue = Array.isArray(valueOfProperty) ? (valueOfProperty as Resource<any>[]).map((e) => e.id) : (valueOfProperty as any).id;
        pojo[attr.name as keyof EntityDTO<Loaded<T, never>>] = transformedValue as EntityDTOProp<any>;
      }
    }
    return pojo;
  }
}
