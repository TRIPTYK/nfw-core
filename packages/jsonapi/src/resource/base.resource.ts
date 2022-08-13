import type { BaseEntity, RequiredEntityData } from '@mikro-orm/core';
import { Reference } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

export abstract class Resource<T extends BaseEntity<T, any>> {
  /**
   * The meta linked with the resource
   */
  declare meta: ResourceMeta<T, this>;
  /**
   * The context in which the resource was created
   */
  declare context: JsonApiContext<T, this>;
  /**
 * The identifier key will always be 'id' in this framework
 */
  abstract id: string;

  toMikroPojo () {
    const pojo = {} as RequiredEntityData<T>;

    for (const attr of this.meta.attributes) {
      const valueOfProperty = this[attr.name];
      if (valueOfProperty !== undefined) {
        pojo[attr.name as keyof RequiredEntityData<T>] = valueOfProperty as any;
      }
    }
    for (const attr of this.meta.relationships) {
      const valueOfProperty = this[attr.name as keyof Resource<T>];
      if (valueOfProperty !== undefined) {
        if (Array.isArray(valueOfProperty)) {
          (pojo as any)[attr.name as any] = valueOfProperty.map((e) => {
            return Reference.createFromPK(attr.mikroMeta.targetMeta?.class!, e.id);
          }) as any;
        } else {
          (pojo as any)[attr.name as any] = Reference.createFromPK(attr.mikroMeta.targetMeta?.class!, (valueOfProperty as any).id);
        }
      }
    }
    return pojo;
  }
}
