/* eslint-disable max-statements */
import type { Loaded, AnyEntity, EntityDTO, BaseEntity } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';

// eslint-disable-next-line complexity
export function createResourceFrom<TModel extends BaseEntity<TModel, any>> (json: EntityDTO<any>, resourceMeta: ResourceMeta<any>, context: JsonApiContext<any>) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource();
  newResource.context = context;
  newResource.resourceMeta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    if (Object.hasOwn(json, attr.name)) {
      newResource[attr.name] = json[attr.name];
    }
  }

  newResource.id = json.id;

  for (const relationship of resourceMeta.relationships) {
    if (Object.hasOwn(json, relationship.name)) {
      if (Array.isArray(json[relationship.name])) {
        newResource[relationship.name as keyof Resource<any>] = json[relationship.name].map((e: Loaded<AnyEntity>) => {
          return createResourceFrom(typeof e === 'object' ? e : { id: e }, relationship.resource, context);
        });
        continue;
      }

      if (json[relationship.name] === undefined || json[relationship.name] === null) {
        (newResource as any)[relationship.name as keyof Resource<any>] = json[relationship.name];
        continue;
      }

      const resourceObj = typeof json[relationship.name] === 'object' ? json[relationship.name] : { id: json[relationship.name] };
      (newResource as any)[relationship.name as keyof Resource<any>] = createResourceFrom(resourceObj, relationship.resource, context);
    }
  }

  return newResource;
}
