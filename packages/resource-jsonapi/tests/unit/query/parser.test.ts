import { expect, it } from 'vitest';
import type { JsonApiQueryParser } from '../../../src/query/parser.js';
import { JsonApiQueryParserImpl } from '../../../src/query/parser.js';

let queryParser: JsonApiQueryParser;

it('Parses a jsonapi query string', () => {
  queryParser = new JsonApiQueryParserImpl();
  const parsed = queryParser.parse(`include=articles&fields[articles]=123&sort=-id&filter=${JSON.stringify({
    coucou: 1
  })}&page[size]=1&page[number]=2`);

  expect(parsed).toStrictEqual({
    fields: { articles: ['123'] },
    include: [{ relationName: 'articles', nested: [] }],
    sort: { id: 'DESC' },
    filter: {
      coucou: 1
    },
    page: {
      size: '1',
      number: '2'
    }
  });
});
