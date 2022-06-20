import type { Loaded, AnyEntity } from '@mikro-orm/core';
import type { ResourceMeta } from '../jsonapi.registry.js';

export function createResourceFrom (json: Record<string, any>, resourceMeta: ResourceMeta) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource() as any;
  newResource.meta = resourceMeta;

  for (const attr of resourceMeta.allowedAttributes) {
    newResource[attr.name] = json[attr.name];
  }

  for (const attr of resourceMeta.allowedRelationships) {
    if (json[attr.name]) {
      newResource[attr.name] = Array.isArray(json[attr.name]) ? json[attr.name].map((e: Loaded<AnyEntity>) => createResourceFrom(e, attr.resource)) : createResourceFrom(json[attr.name], attr.resource);
    }
  }

  return newResource;
}
