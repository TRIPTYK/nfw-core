import { Parser } from 'json-api-query-parser';
import {ResourcesRegistry} from '../registry/registry.js';
import type { JsonApiQuery, PageQuery } from './query.js';
import { QueryValidator } from './validator.js';

export interface JsonApiQueryParser {
    parse(search: string, type: string): JsonApiQuery,
}

export class JsonApiQueryParserImpl implements JsonApiQueryParser {
  private parser = new Parser();

  public constructor (
    public registry: ResourcesRegistry
  ) {}

  public parse (search: string, type: string): JsonApiQuery {
    const parsed = this.parser.parse(search);

    const parsedAsJsonApiQuery: JsonApiQuery = {
      ...parsed,
      include: parsed.include,
      page: parsed.page as PageQuery | undefined,
      filter: parsed.filter ? JSON.parse(parsed.filter as string) : undefined
    };

    this.validateParsed(parsedAsJsonApiQuery, type)

    return parsedAsJsonApiQuery;
  }

  private validateParsed(parsedQuery: JsonApiQuery, type: string) {
     const validator = new QueryValidator(this.registry, type);
    validator.validate(parsedQuery)
  }
}
