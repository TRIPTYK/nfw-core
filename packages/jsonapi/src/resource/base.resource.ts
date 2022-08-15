import type { BaseEntity, RequiredEntityData } from '@mikro-orm/core';
import { Reference } from '@mikro-orm/core';
import { validateOrReject } from 'fastest-validator-decorators';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

// can Amaury read User1
// can Amaury read User2
// can Amaury read User3

// can Amaury create User1
// can Amaury add Article1 to User1

export abstract class Resource<T extends BaseEntity<T, any>> {
  /**
   * The meta linked with the resource
   */
  declare resourceMeta: ResourceMeta<T, this>;
  /**
   * The context in which the resource was created
   */
  declare context: JsonApiContext<T, this>;
  /**
 * The identifier key will always be 'id' in this framework
 */
  abstract id: string;

  metaObject?: Record<string, unknown> | undefined;
  linksObject?: Record<string, unknown> | undefined;

  async validate () {
    return validateOrReject(this);
  }

  toMikroPojo () {
    const pojo = {} as RequiredEntityData<T>;

    for (const attr of this.resourceMeta.attributes) {
      const valueOfProperty = this[attr.name];
      if (valueOfProperty !== undefined) {
        pojo[attr.name as keyof RequiredEntityData<T>] = valueOfProperty as any;
      }
    }
    for (const attr of this.resourceMeta.relationships) {
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
