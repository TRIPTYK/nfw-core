import { Parser } from 'json-api-query-parser';
import type { JsonApiQuery } from './query.js';

export interface JsonApiQueryParser {
    parse(search: string): JsonApiQuery,
}

export class JsonApiQueryParserImpl implements JsonApiQueryParser {
  private parser = new Parser();

  public parse (search: string): JsonApiQuery {
    const parsed = this.parser.parse(search);

    const page = parsed.page;

    const parsedAsJsonApiQuery: JsonApiQuery = {
      ...parsed,
      include: parsed.include,
      page,
      filter: parsed.filter ? JSON.parse(parsed.filter as string) : undefined
    };

    return parsedAsJsonApiQuery;
  }
}
