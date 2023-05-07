import { Parser } from '@triptyk/json-api-query-parser';
import { inject, injectable } from '@triptyk/nfw-core';
import {ResourcesRegistry, ResourcesRegistryImpl} from '../registry/registry.js';
import type { JsonApiQuery, PageQuery } from './query.js';
import { QueryValidator } from './validator.js';

export interface JsonApiQueryParser {
    parse(search: string, type: string): JsonApiQuery,
}

@injectable()
export class JsonApiQueryParserImpl implements JsonApiQueryParser {
  private parser = new Parser();

  public constructor (
    @inject(ResourcesRegistryImpl) public  registry: ResourcesRegistry,
    @inject(QueryValidator) public validator: QueryValidator
  ) {}

  public parse (search: string, type: string): JsonApiQuery {
    const parsed = this.parser.parse(search);


    const parsedAsJsonApiQuery: JsonApiQuery = {
      ...parsed,
      include: parsed.include,
      page: parsed.page as PageQuery | undefined,
      filter: ((parsed.filter ?? []) as any).reduce((p: any,c: any) => {
        p[c.key.replace(/\[|\]/g, "")] = c.value;
        return p;
      }, {})
    };

    this.validator.validate(type,parsedAsJsonApiQuery);

    return parsedAsJsonApiQuery;
  }
}
