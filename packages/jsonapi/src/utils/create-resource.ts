import type { Loaded, AnyEntity } from '@mikro-orm/core';

export function createResourceFrom (json: Record<string, any>, resourceMeta: any) {
  // eslint-disable-next-line new-cap
  const newResource = new resourceMeta.resource();
  newResource.meta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    newResource[attr.name as keyof typeof newResource] = json[attr.name];
  }

  newResource.id = json.id;

  for (const attr of resourceMeta.relationships) {
    if (json[attr.name]) {
      newResource[attr.name as keyof typeof newResource] = Array.isArray(json[attr.name]) ? json[attr.name].map((e: Loaded<AnyEntity>) => createResourceFrom(e, attr.resource)) : createResourceFrom(json[attr.name], attr.resource);
    }
  }

  return newResource;
}
