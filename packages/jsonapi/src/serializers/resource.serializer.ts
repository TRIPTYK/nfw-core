/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-params */
import type { BaseEntity } from '@mikro-orm/core';
import { container, injectable } from '@triptyk/nfw-core';
import type { StringKeyOf } from 'type-fest';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { RelationMeta, ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import type { Include } from '../query-parser/query.js';
import type { Resource } from '../resource/base.resource.js';
import type { JsonApiTopLevel, LinkObject, PaginationLinksKeys, RelationshipsObject, ResourceIdentifierObject, ResourceObject } from './spec.interface.js';

@injectable()
export class ResourceSerializer<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
  public declare resource: ResourceMeta<TModel, TResource>;

  public get baseURL () {
    const registry = container.resolve(JsonApiRegistry);
    return registry.apiPath;
  }

  public serialize (resource: TResource | TResource[], jsonApiContext: JsonApiContext<TModel>, totalRecords: number | undefined = undefined, includeLevel?: Map<string, Include<any>>): Promise<JsonApiTopLevel> | JsonApiTopLevel {
    const included = new Map<string, any>();
    return this.serializeBase(resource, jsonApiContext, totalRecords, Array.isArray(resource) ? resource.map((r) => this.serializeDocument(r as any, included, jsonApiContext, includeLevel ?? jsonApiContext.query?.includes)) : this.serializeDocument(resource as any, included, jsonApiContext, includeLevel ?? jsonApiContext.query?.includes), included);
  }

  public async serializeRelationships (resource: TResource, jsonApiContext: JsonApiContext<TModel>, totalRecords: number | undefined = undefined, relation: StringKeyOf<TResource>): Promise<JsonApiTopLevel> {
    const included = new Map<string, any>();
    return this.serializeBase(resource, jsonApiContext, totalRecords,
      this.serializeRelationshipsDocument(
        resource as any,
        included,
        jsonApiContext,
        jsonApiContext.query?.includes,
        resource.resourceMeta.relationships.find((r) => r.name === relation)!
      ), included);
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
      };
    }
    return {};
  }

  /**
   * Setups JsonApiTopLevel object with @data
   */
  protected serializeBase (resource: TResource | TResource[], jsonApiContext: JsonApiContext<TModel>, totalRecords: number | undefined, data: JsonApiTopLevel['data'], included: Map<string, any>) {
    return {
      jsonapi: {
        version: '1.0'
      },
      links: {
        ...this.paginationLinks(resource, jsonApiContext, totalRecords),
        self: jsonApiContext.koaContext.url
      },
      meta: this.topMeta(resource, jsonApiContext),
      data,
      included: included.size > 0 ? Array.from(included.values()) : undefined
    } as JsonApiTopLevel;
  }

  protected serializeResourceIdentifiers (data: Resource<any> | Resource<any>[] | undefined | null, rel: RelationMeta<any>): ResourceIdentifierObject | ResourceIdentifierObject[] | null {
    if (!data) {
      // spec need null
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((rscData) => this.serializeResourceIdentifiers(rscData, rel)) as ResourceIdentifierObject[];
    }
    return {
      type: rel.resource.name,
      id: data?.id
    };
  }

  protected serializeRelationshipsDocument<T extends BaseEntity<any, 'id'>> (resource: Resource<T>, included: Map<string, any>, jsonApiContext: JsonApiContext<TModel>, includeLevel: Map<string, Include<any>> | undefined, relation: RelationMeta<T>): ResourceIdentifierObject | ResourceIdentifierObject[] | null {
    for (const rel of resource.resourceMeta.relationships!) {
      const relation = resource[rel.name as keyof typeof resource] as unknown as Resource<any> | Resource<any>[];

      /**
       * ONLY RETURNS RELATIONSHIPS THAT ARE REQUESTED TO BE INCLUDED
       */
      const includes = includeLevel?.get(rel.name);

      if (relation !== undefined && includes) {
        this.processRelation(undefined, includes, included, relation, rel, jsonApiContext);
      }
    }
    return this.serializeResourceIdentifiers(resource[relation.name] as any, relation);
  }

  /**
   *
   * @param relationships The relationships object to add
   * @param includes the includes of query
   * @param included the included Map
   * @param relation the relation name
   * @param rel the relation metadata
   * @param jsonApiContext the context
   */
  protected processRelation (relationships: RelationshipsObject | undefined, includes: Include<any>, included: Map<string, any>, relation : Resource<any> | Resource<any>[] | null | undefined, rel : RelationMeta<any, Resource<any>>, jsonApiContext: JsonApiContext<any>) {
    const resourceIndentifiers = this.serializeResourceIdentifiers(relation, rel);
    if (relationships) {
      relationships[rel.name].data = resourceIndentifiers;
    }
    for (const r of Array.isArray(relation) ? relation : [relation]) {
      if (r?.id && !included.has(r.id)) {
        included.set(r.id, this.serializeDocument(r, included, jsonApiContext, includes.includes));
      }
    }
    return resourceIndentifiers;
  }

  protected serializeDocument (resource: Resource<any>, included: Map<string, any>, jsonApiContext: JsonApiContext<TModel>, includeLevel?: Map<string, Include<any>>): ResourceObject {
    const fetchableFields = resource.resourceMeta.attributes.filter((f) => f.isFetchable && f.name !== 'id');

    const attributes = {} as any;

    for (const field of fetchableFields) {
      attributes[field.name] = resource[field.name];
    }

    const relationships: RelationshipsObject = {};

    for (const rel of resource.resourceMeta.relationships) {
      const relation = resource[rel.name as keyof typeof resource] as unknown as Resource<any> | Resource<any>[];

      relationships[rel.name] = {
        links: rel.links
          ? rel.links.call(resource)
          : {
              self: resource.resourceMeta.routes.hasRelationships ? `${this.baseURL}/${resource.resourceMeta.name}/${resource.id}/relationships/${rel.name}` : undefined,
              related: resource.resourceMeta.routes.hasRelated ? `${this.baseURL}/${resource.resourceMeta.name}/${resource.id}/${rel.name}` : undefined
            }
      };

      /**
       * ONLY RETURNS RELATIONSHIPS THAT ARE REQUESTED TO BE INCLUDED
       */
      const includes = includeLevel?.get(rel.name);

      if (relation !== undefined && includes) {
        this.processRelation(relationships, includes, included, relation, rel, jsonApiContext);
      }
    }

    return {
      id: resource.id,
      meta: resource.metaObject,
      links: resource.linksObject ?? {
        self: `${this.baseURL}/${resource.resourceMeta.name}/${resource.id}`
      },
      type: resource.resourceMeta.name,
      attributes,
      relationships
    };
  }
}
