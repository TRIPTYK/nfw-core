import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';

export class QueryParser {
  public declare meta: ResourceMeta;
  public declare context: JsonApiContext<unknown>;

  constructor (public originalQuery: Record<string, any>) {
    this.includes = originalQuery.include.split(',');
    this.fields = originalQuery.include.split(',');
    this.sort = originalQuery.sort.split(',');
    this.pagination = {
      page: originalQuery.page.number,
      size: originalQuery.page.size
    }
  }

  public includes: string[] = [];
  public fields: string[] = [];
  public sort: string[] = [];
  public pagination?: {
    page: number,
    size: number,
  }
}
