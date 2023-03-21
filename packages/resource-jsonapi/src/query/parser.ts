import { Parser } from 'json-api-query-parser';
import type { JsonApiQuery } from './query.js';

export interface JsonApiQueryParser {
    parse(search: string): JsonApiQuery,
}

export class JsonApiQueryParserImpl implements JsonApiQueryParser {
  private parser = new Parser();

  public parse (search: string): JsonApiQuery {
    const parsed = this.parser.parse(search);

    const page = parsed.page as Record<string, string>;

    const parsedAsJsonApiQuery: JsonApiQuery = {
      ...parsed,
      include: parsed.include,
      page: {
        number: page?.number,
        size: page?.size
      },
      filter: parsed.filter ? JSON.parse(parsed.filter as string) : undefined
    };

    return parsedAsJsonApiQuery;
  }
}
