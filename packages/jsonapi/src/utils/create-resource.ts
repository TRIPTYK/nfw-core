import type { Loaded, AnyEntity } from '@mikro-orm/core';
import type { ResourceMeta } from '../jsonapi.registry.js';

export function createResourceFrom (json: Record<string, any>, resourceMeta: ResourceMeta) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource() as any;
  newResource.meta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    newResource[attr.name] = json[attr.name];
  }

  newResource.id = json.id;

  for (const attr of resourceMeta.relationships) {
    if (json[attr.name]) {
      newResource[attr.name] = Array.isArray(json[attr.name]) ? json[attr.name].map((e: Loaded<AnyEntity>) => createResourceFrom(e, attr.resource)) : createResourceFrom(json[attr.name], attr.resource);
    }
  }

  return newResource;
}
