import JSONAPISerializer from "json-api-serializer";
import {ResourceSchema} from "../interfaces/schema.js";
import {PaginationData} from "../interfaces/serializer.js";
import { ResourcesRegistryImpl } from "../registry/registry.js";
import {filterForWhitelist} from "../utils/whitelist-filter.js";
import {BaseSerializerGenerator} from "./base.js";

export class SerializerGenerator extends BaseSerializerGenerator {
  public constructor (
    protected registry: ResourcesRegistryImpl,
    protected serializer: JSONAPISerializer
  ) {
    super(registry, serializer);
  }

  public baseSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(schema: T): JSONAPISerializer.Options {
    return {
      relationships: {},
      whitelist: filterForWhitelist(schema.attributes, "serialize"),
      topLevelLinks: (data, extraData: unknown) => {
        const paginationData = extraData as PaginationData | {};
        const recordData = data as { id?: string }
        if (Object.keys(paginationData).length === 0) {
          return this.topLevelLinksBuilder(schema.type, recordData);
        }
        return this.topLevelLinksBuilderWithPagination.call(this, schema.type, recordData, paginationData as PaginationData);
      },
      links: (data) => this.topLevelLinksBuilder(schema.type, data as { id?: string }) 
    };
  }

  get config() {
    return this.registry.getConfig();
  }

  private topLevelLinksBuilder(type: string, data: { id?: string }) {
    return { 
      self: `${this.config.host}/${type}${data.id ? `/${data.id}` : ''}`,
    }
  }

  private topLevelLinksBuilderWithPagination(type: string, data: {id?: string}, paginationData: PaginationData) {
    const baseTopLevelLinks = { 
      ...this.topLevelLinksBuilder(type, data),
      first: `${this.config.host}/${type}?page[number]=1&page[size]=${paginationData.size}`,
      last: `${this.config.host}/${type}?page[number]=${paginationData.total}&page[size]=${paginationData.size}`,
    }
    if (this.isNotLastPage(paginationData.number, paginationData.total)) {
      return {
        ...baseTopLevelLinks,
        next: `${this.config.host}/${type}?page[number]=${Number(paginationData.number) + 1}&page[size]=${paginationData.size}`
      }
    }
    return baseTopLevelLinks;
  }

  private isNotLastPage(pageNumber: string, total: string) {
    return Number(pageNumber) < Number(total)
  }
}
