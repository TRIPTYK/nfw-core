import type { BaseEntity } from '@mikro-orm/core';
import { ReferenceType } from '@mikro-orm/core';
import { injectable } from '@triptyk/nfw-core';
import { BadRequestError } from '../errors/bad-request.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

@injectable()
export class ResourceDeserializer<TModel extends BaseEntity<TModel, any>> {
  public declare resource: ResourceMeta<TModel>;

  deserialize (payload: Record<string, unknown>, context: JsonApiContext<TModel>): Promise<Resource<TModel>> | Resource<TModel> {
    // eslint-disable-next-line new-cap
    if (!payload.data) {
      throw new BadRequestError('Not a json-api payload');
    }

    const data = payload.data as {
      attributes?: Record<string, unknown>,
      relationships?: Record<string, Record<'data', unknown>>,
      id?: string,
    };

    const jsonApiBody = data.attributes ?? {};

    // eslint-disable-next-line new-cap
    const newResource = new this.resource.resource();
    newResource.id = data.id;
    newResource.resourceMeta = this.resource;

    for (const property of Object.keys(jsonApiBody)) {
      if (!this.resource.attributes.some((p) => {
        return p.name === property && (context.method === JsonApiMethod.CREATE ? p.createable : p.updateable)
      })) {
        throw new BadRequestError(`Property ${property} is not allowed in body`);
      }
    }

    const relationships = data.relationships ?? {};

    for (const [key, value] of Object.entries(relationships)) {
      const relationMeta = this.resource.relationships.find((p) => p.name === key);
      if (!relationMeta) {
        throw new BadRequestError(`Relationship ${key} does not exists in ${this.resource.name}`);
      }
      const data = value.data;
      if (!data) {
        throw new BadRequestError(`Please provide data to relationships object ${key}`);
      }

      if (relationMeta.mikroMeta.reference === ReferenceType.MANY_TO_MANY || relationMeta.mikroMeta.reference === ReferenceType.ONE_TO_MANY) {
        if (!Array.isArray(data)) {
          throw new BadRequestError(`Relationship data for ${key} must be an array`);
        }

        (newResource as any)[key] = data.map((d) => {
          // eslint-disable-next-line new-cap
          const r = new relationMeta.resource.resource();
          r.resourceMeta = relationMeta.resource;
          r.id = d.id;
          return r;
        });
      } else {
        if (typeof data !== 'object' && data !== null) {
          throw new BadRequestError(`Relationship data for ${key} must be an null or an object`);
        }

        // eslint-disable-next-line new-cap
        const r = new relationMeta.resource.resource();
        r.id = (data as Record<'id', string>).id;

        (newResource as any)[key] = r;
      }
    }

    Object.assign(newResource, jsonApiBody);
    return newResource;
  }
}
