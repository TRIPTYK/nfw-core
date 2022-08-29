import type { Loaded, AnyEntity, EntityDTO, BaseEntity } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';

export function createResourceFrom<TModel extends BaseEntity<TModel, any>> (json: EntityDTO<any>, resourceMeta: ResourceMeta<any>, context: JsonApiContext<any>) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource();
  newResource.context = context;
  newResource.resourceMeta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    newResource[attr.name] = json[attr.name];
  }

  newResource.id = json.id;

  for (const attr of resourceMeta.relationships) {
    if (json[attr.name]) {
      if (Array.isArray(json[attr.name])) {
        newResource[attr.name as keyof Resource<any>] = json[attr.name].map((e: Loaded<AnyEntity>) => {
          return createResourceFrom(typeof e === 'object' ? e : { id: e }, attr.resource, context)
        });
        continue;
      }
      const resourceObj = typeof json[attr.name] === 'object' ? json[attr.name] : { id: json[attr.name] };
      (newResource as any)[attr.name as keyof Resource<any>] = createResourceFrom(resourceObj, attr.resource, context);
    }
  }

  return newResource;
}
