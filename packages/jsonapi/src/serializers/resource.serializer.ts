import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { JsonApiModelInterface } from '../interfaces/model.interface.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';
import type { AttributesObject, JsonApiTopLevel, RelationshipsObject, ResourceObject } from './spec.interface.js';

export class ResourceSerializer<T extends JsonApiModelInterface> {
  public declare resource: ResourceMeta;

  public serialize (resource: Resource<T> | Resource<T>[], context: JsonApiContext<T>): JsonApiTopLevel {
    const included = new Map<string, any>();
    return {
      jsonapi: {
        version: '1.1'
      },
      data: Array.isArray(resource) ? resource.map((r) => this.serializeDocument(r, included)) : this.serializeDocument(resource, included),
      included: Array.from(included.values())
    }
  }

  protected serializeDocument (resource: Resource<unknown>, included: Map<string, any>): ResourceObject {
    const fetchableFields = resource.meta.attributes;

    const attributes: AttributesObject = {};

    for (const field of fetchableFields) {
      attributes[field.name] = resource[field.name as keyof Resource<unknown>];
    }

    const relationships: RelationshipsObject = {};

    for (const rel of resource.meta.relationships) {
      const relation = resource[rel.name as keyof Resource<unknown>] as unknown as Resource<unknown> | Resource<unknown>[];

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
