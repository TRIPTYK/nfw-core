import type { ResourcesRegistry } from '../registry/registry.js';
import { ResourcesRegistryImpl } from '../registry/registry.js';
import type { ContextData, ResourceSerializer } from '../interfaces/serializer.js';
import type { JsonApiQuery } from '../query/query.js';
import { DocumentSerializer } from './document.js';
import { arrayWithElementsOrUndefined } from '../utils/array-with-elements-or-undefined.js';
import type { JsonApiTopLevelDocument } from '../types/jsonapi-spec.js';
import type { Resource } from '../interfaces/resource.js';
import type { SetRequired } from 'type-fest';
import { inject, singleton } from '@triptyk/nfw-core';

const JSONAPI_HEADER = {
  jsonapi: {
    version: '1.0',
  },
};

@singleton()
export class JsonApiResourceSerializer implements ResourceSerializer {
  public constructor (
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry,
  ) {
  }

  get config () {
    return this.registry.getConfig();
  }

  public async serializeMany (resources: Resource[], query: JsonApiQuery, contextData: ContextData): Promise<JsonApiTopLevelDocument> {
    const { data, included } = new DocumentSerializer(this.registry, query).serializeTopLevelDocuments(resources);

    return {
      ...JSONAPI_HEADER,
      data,
      meta: undefined,
      included: arrayWithElementsOrUndefined(included),
      links: this.makeTopLevelLinks(contextData),
    };
  }

  public async serializeOne (resource: Resource, query: JsonApiQuery, contextData: ContextData): Promise<JsonApiTopLevelDocument> {
    const { data, included } = new DocumentSerializer(this.registry, query).serializeTopLevelDocuments(resource);

    return {
      ...JSONAPI_HEADER,
      data,
      meta: undefined,
      included: arrayWithElementsOrUndefined(included),
      links: this.makeTopLevelLinks(contextData),
    };
  }

  private makeTopLevelLinks (contextData: ContextData) {
    return {
      self: `${this.config.host}/${contextData.endpointURL}`,
      ...contextData.pagination ? this.makePaginationLinks(contextData as SetRequired<ContextData, 'pagination'>) : undefined,
    };
  }

  private makePaginationLinks (contextData: SetRequired<ContextData, 'pagination'>) {
    const baseTopLevelLinks = {
      first: `${this.config.host}/${contextData.endpointURL}?page[number]=1&page[size]=${contextData.pagination.size}`,
      last: `${this.config.host}/${contextData.endpointURL}?page[number]=${contextData.pagination.total}&page[size]=${contextData.pagination.size}`,
    };
    if (this.isNotLastPage(contextData.pagination.number, contextData.pagination.total)) {
      return {
        ...baseTopLevelLinks,
        next: `${this.config.host}/${contextData.endpointURL}?page[number]=${contextData.pagination.number + 1}&page[size]=${contextData.pagination.size}`,
      };
    }
    return baseTopLevelLinks;
  }

  // eslint-disable-next-line class-methods-use-this
  private isNotLastPage (pageNumber: number, total: number) {
    return pageNumber < total;
  }
}
