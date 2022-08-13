import type { BaseEntity } from '@mikro-orm/core';
import { injectable } from '@triptyk/nfw-core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';
import type { JsonApiTopLevel, RelationshipsObject, ResourceObject } from './spec.interface.js';

@injectable()
export class ResourceSerializer<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
  public declare resource: ResourceMeta<TModel, TResource>;

  public serialize (resource: TResource | TResource[], _jsonApiContext: JsonApiContext<TModel, TResource>): JsonApiTopLevel {
    const included = new Map<string, any>();
    return {
      jsonapi: {
        version: '1.1'
      },
      data: Array.isArray(resource) ? resource.map((r) => this.serializeDocument(r as any, included)) : this.serializeDocument(resource as any, included),
      included: included.size > 0 ? Array.from(included.values()) : undefined
    }
  }

  protected serializeDocument (resource: TResource, included: Map<string, any>): ResourceObject {
    const fetchableFields = resource.meta.attributes;

    const attributes = {} as Record<keyof TResource, any>;

    for (const field of fetchableFields) {
      attributes[field.name] = resource[field.name as keyof TResource];
    }

    const relationships: RelationshipsObject = {};

    for (const rel of resource.meta.relationships) {
      const relation = resource[rel.name as keyof typeof resource] as any;

      if (relation) {
        const ids = Array.isArray(relation) ? relation.map((e) => ({ type: rel.resource.name, id: e.id })) : { type: rel.resource.name, id: relation.id };

        relationships[rel.name] = {
          links: {
            self: `${resource.meta.name}/${resource.id}/relationships/${rel.name}`,
            related: `${resource.meta.name}/${resource.id}/${rel.name}`
          },
          data: ids
        }

        for (const r of Array.isArray(relation) ? relation : [relation]) {
          if (!included.has(r.id)) {
            included.set(r.id, this.serializeDocument(r, included));
          }
        }
      }
    }

    return {
      id: resource.id,
      links: {
        self: `${resource.meta.name}/${resource.id}`
      },
      type: resource.meta.name,
      attributes,
      relationships
    }
  }
}
