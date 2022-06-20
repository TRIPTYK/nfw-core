import type { JsonApiModelInterface } from '../interfaces/model.interface.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';

export class JsonApiSerializer<T extends JsonApiModelInterface> {
  public declare resource: ResourceMeta;

  public serialize (resource: Resource<T> | Resource<T>[]) {
    const included = new Map<string, any>();
    return {
      jsonapi: {
        version: '1.1'
      },
      data: Array.isArray(resource) ? resource.map((r) => this.serializeDocument(r, included)) : this.serializeDocument(resource, included),
      included: Array.from(included.values())
    }
  }

  protected serializeDocument (resource: Resource<unknown>, included: Map<string, any>) {
    const fetchableFields = resource.meta.allowedAttributes.filter((aa) => aa.fetchable);

    const attributes: Record<string, any> = {};

    for (const field of fetchableFields) {
      attributes[field.name] = resource[field.name as keyof Resource<unknown>];
    }

    const relationships: Record<string, any> = {};

    for (const rel of resource.meta.allowedRelationships) {
      const relation = resource[rel.name as keyof Resource<unknown>] as unknown as Resource<unknown> | Resource<unknown>[];
      if (relation) {
        const ids = Array.isArray(relation) ? relation.map((e) => e.id) : relation.id;
        relationships[rel.name] = {
          type: rel.resource.name,
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
      type: resource.meta.name,
      attributes,
      relationships
    }
  }
}
