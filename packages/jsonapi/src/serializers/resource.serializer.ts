import type { BaseEntity } from '@mikro-orm/core';
import { container, injectable } from '@triptyk/nfw-core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';
import type { JsonApiTopLevel, LinkObject, PaginationLinksKeys, RelationshipsObject, ResourceObject } from './spec.interface.js';

@injectable()
export class ResourceSerializer<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
  public declare resource: ResourceMeta<TModel, TResource>;

  protected get baseURL () {
    const registry = container.resolve(JsonApiRegistry);
    return registry.apiPath;
  }

  protected topMeta (_resource: TResource | TResource[], _jsonApiContext: JsonApiContext<TModel, TResource>): JsonApiTopLevel['meta'] {
    return undefined;
  }

  protected paginationLinks (_resource: TResource | TResource[], jsonApiContext: JsonApiContext<TModel, TResource>, totalRecords?: number): Record<PaginationLinksKeys, string | LinkObject | null> | {} {
    if (jsonApiContext.query?.page && totalRecords) {
      const url = jsonApiContext.koaContext.URL;
      const searchParams = url.searchParams;

      const lastPage = Math.floor(
        totalRecords / jsonApiContext.query.size!
      );
      const previousPage =
            jsonApiContext.query.page <= 1 ? 1 : jsonApiContext.query.page - 1;
      const nextPage =
            jsonApiContext.query.page >= lastPage
              ? lastPage
              : jsonApiContext.query.page + 1;

      const firstParsedURL = new URLSearchParams(searchParams);
      const lastParsedURL = new URLSearchParams(searchParams);
      const prevParsedURL = new URLSearchParams(searchParams);
      const nextParsedURL = new URLSearchParams(searchParams);

      firstParsedURL.set('page[number]', '1');
      lastParsedURL.set('page[number]', lastPage.toString());
      prevParsedURL.set('page[number]', previousPage.toString());
      nextParsedURL.set('page[number]', nextPage.toString());

      return {
        first: `${url.pathname}?${firstParsedURL}`,
        last: `${url.pathname}?${lastParsedURL}`,
        prev: `${url.pathname}?${prevParsedURL}`,
        next: `${url.pathname}?${nextParsedURL}`
      }
    }
    return {}
  }

  public serialize (resource: TResource | TResource[], jsonApiContext: JsonApiContext<TModel, TResource>, totalRecords?: number): JsonApiTopLevel {
    const included = new Map<string, any>();
    return {
      jsonapi: {
        version: '1.0'
      },
      links: {
        ...this.paginationLinks(resource, jsonApiContext, totalRecords),
        self: jsonApiContext.koaContext.URL.pathname
      },
      meta: this.topMeta(resource, jsonApiContext),
      data: Array.isArray(resource) ? resource.map((r) => this.serializeDocument(r as any, included)) : this.serializeDocument(resource as any, included),
      included: included.size > 0 ? Array.from(included.values()) : undefined
    } as JsonApiTopLevel
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
            self: `${this.baseURL}/${resource.meta.name}/${resource.id}/relationships/${rel.name}`,
            related: `${this.baseURL}/${resource.meta.name}/${resource.id}/${rel.name}`
          },
          data: ids
        }

        for (const r of Array.isArray(relation) ? relation : [relation]) {
          if (r.id && !included.has(r.id)) {
            included.set(r.id, this.serializeDocument(r, included));
          }
        }
      }
    }

    return {
      id: resource.id,
      links: {
        self: `${this.baseURL}/${resource.meta.name}/${resource.id}`
      },
      type: resource.meta.name,
      attributes,
      relationships
    }
  }
}
