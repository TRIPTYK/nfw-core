import { Parser } from 'json-api-query-parser';
import type { JsonApiQuery, PageQuery } from './query.js';
import { QueryValidator } from './validator.js';

export interface JsonApiQueryParser {
    parse(search: string, type: string): JsonApiQuery,
}

export class JsonApiQueryParserImpl implements JsonApiQueryParser {
  private parser = new Parser();

  public parse (search: string, type: string): JsonApiQuery {
    const parsed = this.parser.parse(search);

    const parsedAsJsonApiQuery: JsonApiQuery = {
      ...parsed,
      include: parsed.include,
      page: parsed.page as PageQuery | undefined,
      filter: parsed.filter ? JSON.parse(parsed.filter as string) : undefined
    };

    return parsedAsJsonApiQuery;
  }

  private validateParsed(parsedQuery: JsonApiQuery, type: string) {
     const validator = new QueryValidator(this.registry);
      
  }
}
