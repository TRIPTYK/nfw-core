import type { BaseEntity } from '@mikro-orm/core';
import { injectable } from '@triptyk/nfw-core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

@injectable()
export class ResourceDeserializer<TModel extends BaseEntity<TModel, any>> {
  public declare resource: ResourceMeta<TModel>;

  deserialize (payload: Record<string, unknown>, context: JsonApiContext<TModel>): Resource<TModel> {
    // eslint-disable-next-line new-cap
    if (!payload.data) {
      throw new Error('Not a json-api payload');
    }

    if (!(payload.data as Record<string, unknown>)?.attributes) {
      throw new Error('Not attributes specified');
    }

    const jsonApiBody = (payload.data as Record<string, unknown>).attributes as Record<string, unknown>;

    // eslint-disable-next-line new-cap
    const newResource = new this.resource.resource();

    for (const property of Object.keys(jsonApiBody)) {
      if (!this.resource.attributes.some((p) => {
        return p.name === property && (context.method === JsonApiMethod.CREATE ? p.createable : p.updateable)
      })) {
        throw new Error(`Property ${property} is not allowed in body`);
      }
    }

    Object.assign(newResource, payload);
    return newResource;
  }
}
