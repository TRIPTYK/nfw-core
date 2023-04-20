import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it, describe } from 'vitest';
import { JsonApiQueryParser, JsonApiQueryParserImpl } from '../../../../src/query/parser.js';
import { ResourcesRegistryImpl } from '../../../../src';
import { UnallowedSortFieldError } from '../../../../src/errors/unallowed-sort-field.js';

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
        banane: { 
          serialize: true,
          sort:true,
          deserialize: true,
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
          sort: false,
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

describe('Sort Validator', () => {
  const unallowedSortError = new UnallowedSortFieldError("123 are not allowed as sort field for articles", ['123']);

  it('Throw an error when sort field is not true in schema', () => {
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('sort=123', 'articles')).toThrowError(unallowedSortError);
  });

  it('to resolve successfully if sort field is true in schema', () => {
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('sort=banane', 'example')).not.toThrowError();
  });

  describe('Nested', () => {
    it('Throw an error when sort field is not true in schema', () => {
      queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
      expect(() => queryParser.parse('sort=articles.123', 'example')).toThrowError(unallowedSortError);
    });

    it('to resolve successfully if sort field is true in schema', () => {
      queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
      expect(() => queryParser.parse('sort=example.banane', 'articles')).not.toThrowError();
    });
  })
})
