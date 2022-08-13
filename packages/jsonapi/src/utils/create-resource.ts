import type { Loaded, AnyEntity } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

export function createResourceFrom (json: Record<string, any>, resourceMeta: ResourceMeta<any>, context: JsonApiContext<any>) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource();
  newResource.meta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    newResource[attr.name as keyof typeof newResource] = json[attr.name];
  }

  newResource.id = json.id;

  for (const attr of resourceMeta.relationships) {
    if (json[attr.name]) {
      newResource[attr.name as keyof typeof newResource] =
        Array.isArray(json[attr.name])
          ? json[attr.name].map((e: Loaded<AnyEntity>) => createResourceFrom(e, attr.resource, context))
          : createResourceFrom(json[attr.name], attr.resource, context);
    }
  }

  return newResource;
}
