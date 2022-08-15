import type { BaseEntity, EntityDTO, Loaded } from '@mikro-orm/core';
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
  abstract id?: string;

  metaObject?: Record<string, unknown> | undefined;
  linksObject?: Record<string, unknown> | undefined;

  abstract validate (): void;

  toMikroPojo () {
    const pojo = {} as Partial<EntityDTO<Loaded<T, never>>>;

    for (const attr of this.resourceMeta.attributes) {
      const valueOfProperty = this[attr.name];
      if (valueOfProperty !== undefined) {
        pojo[attr.name as keyof Partial<EntityDTO<Loaded<T, never>>>] = valueOfProperty as any;
      }
    }
    for (const attr of this.resourceMeta.relationships) {
      const valueOfProperty = (this as any)[attr.name] as Resource<any>;
      if (valueOfProperty !== undefined) {
        pojo[attr.name as keyof Partial<EntityDTO<Loaded<T, never>>>] = (Array.isArray(valueOfProperty) ? valueOfProperty.map((e) => e.id) : valueOfProperty.id) as any;
      }
    }
    return pojo;
  }
}
