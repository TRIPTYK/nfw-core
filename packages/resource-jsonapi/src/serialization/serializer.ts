import { ResourcesRegistry } from '../registry/registry.js';
import { PaginationData, ResourceSerializer } from '../interfaces/serializer.js';
import { JsonApiQuery } from '../query/query.js';
import { Resource } from '../interfaces/resource.js';
import { ResourceSchema, } from '../interfaces/schema.js';
import { DocumentSerializer } from './document.js';
import { arrayWithElementsOrUndefined } from '../utils/array-with-elements-or-undefined.js';

const JSONAPI_HEADER = {
  jsonapi: {
    version : '1.0'
  }
};

export class JsonApiResourceSerializer<T extends Resource> implements ResourceSerializer<T> {
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {
  }

  get  config() {
    return this.registry.getConfig();
  }

  public async serializeMany (resources: T[], query: JsonApiQuery, paginationData?: PaginationData): Promise<unknown> {
    const schema = this.registry.getSchemaFor(this.type);
    const { data, included } = new DocumentSerializer(this.registry, query).serializeTopLevelDocuments(resources, schema);

    return {
      ...JSONAPI_HEADER,
      data,
      meta: undefined,
      included: arrayWithElementsOrUndefined(included),
      links: this.makeTopLevelLinks(schema, undefined, paginationData)
    }
  }

  public async serializeOne (resource: T,query: JsonApiQuery): Promise<unknown> {
    const schema = this.registry.getSchemaFor(this.type);
    const { data, included } = new DocumentSerializer(this.registry, query).serializeTopLevelDocuments(resource, schema);

    return {
      ...JSONAPI_HEADER,
      data,
      meta: undefined,
      included: arrayWithElementsOrUndefined(included),
      links: this.makeTopLevelLinks(schema, resource, undefined)
    }
  }
  private makeTopLevelLinks(schema: ResourceSchema<Record<string, unknown>>, resource: T | undefined, paginationData: PaginationData |  undefined) {
    return {
      self: `${this.registry.getConfig().host}/${schema.type}${resource ? `/${resource.id}` : ''}`,
      ...paginationData ? this.makePaginationLinks(paginationData): undefined
    };
  }

  private makePaginationLinks(paginationData: PaginationData) {
    const baseTopLevelLinks = { 
      first: `${this.config.host}/${this.type}?page[number]=1&page[size]=${paginationData.size}`,
      last: `${this.config.host}/${this.type}?page[number]=${paginationData.total}&page[size]=${paginationData.size}`,
    }
    if (this.isNotLastPage(paginationData.number, paginationData.total)) {
      return {
        ...baseTopLevelLinks,
        next: `${this.config.host}/${this.type}?page[number]=${paginationData.number + 1}&page[size]=${paginationData.size}`
      }
    }
    return baseTopLevelLinks;
  }

  private isNotLastPage(pageNumber: number, total: number) {
    return pageNumber < total
  }
}


