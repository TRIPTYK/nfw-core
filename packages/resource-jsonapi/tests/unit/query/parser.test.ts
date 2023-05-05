import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it } from 'vitest';
import { ResourcesRegistryImpl } from '../../../src/index.js';
import type { JsonApiQueryParser } from '../../../src/query/parser.js';
import { JsonApiQueryParserImpl } from '../../../src/query/parser.js';

let queryParser: JsonApiQueryParser;
let resourcesRegistry: ResourcesRegistryImpl;

@singleton()
class ExampleSerializer {}
@singleton()
class ExampleDeserializer {}

beforeEach(() => {
  resourcesRegistry = container.resolve(ResourcesRegistryImpl);
  resourcesRegistry.register('example', {
    serializer: ExampleSerializer as never,
    deserializer: ExampleDeserializer as never,
    schema: {
      type: 'example',
      attributes: {
        id: { 
          serialize: true,
          deserialize: true,
          sort: true
        },
        coucou: {
          filter: true
        }
      },
      relationships: {
        articles: {
        }
      }
    } as never
  });
  resourcesRegistry.register('articles', {
    serializer: ExampleSerializer as never,
    deserializer: ExampleDeserializer as never,
    schema: {
      type: 'articles',
      attributes: {
        '123': { 
          serialize: true,
          deserialize: true,
        }
      },
      relationships: {
        example: {
        }
      }
    } as never
  });
});


it('Parses a jsonapi query string', () => {
  queryParser = container.resolve(JsonApiQueryParserImpl);
  const parsed = queryParser.parse(`include=articles&fields[articles]=123&sort=-id&filter=${JSON.stringify({
    coucou: 1
  })}&page[size]=1&page[number]=2`, 'example');

  expect(parsed).toStrictEqual({
    fields: { articles: ['123'] },
    include: [{ relationName: 'articles', nested: [] }],
    sort: { id: 'DESC' },
    filter: {
      coucou: 1
    },
    page: {
      size: 1,
      number: 2
    }
  });
});
