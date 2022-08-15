import type { Loaded, AnyEntity } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

export function createResourceFrom (json: Record<string, any>, resourceMeta: ResourceMeta<any>, context: JsonApiContext<any>) {
  // eslint-disable-next-line new-cap
  const newResource: any = new resourceMeta.resource();
  newResource.resourceMeta = resourceMeta;

  for (const attr of resourceMeta.attributes) {
    newResource[attr.name as any] = json[attr.name];
  }

  newResource.id = json.id;

  for (const attr of resourceMeta.relationships) {
    if (json[attr.name]) {
      if (Array.isArray(json[attr.name])) {
        newResource[attr.name as any] = json[attr.name].map((e: Loaded<AnyEntity>) => {
          return createResourceFrom(typeof e === 'object' ? e : { id: e }, attr.resource, context)
        });
        continue;
      }
      const resourceObj = typeof json[attr.name] === 'object' ? json[attr.name] : { id: json[attr.name] };
      newResource[attr.name as any] = createResourceFrom(resourceObj, attr.resource, context);
    }
  }

  return newResource;
}
