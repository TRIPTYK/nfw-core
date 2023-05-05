import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it, describe } from 'vitest';
import {  ResourcesRegistryImpl } from '../../../../src/index.js';
import type { JsonApiQueryParser } from '../../../../src/query/parser.js';
import { JsonApiQueryParserImpl } from '../../../../src/query/parser.js';
import { UnallowedFilterError } from '../../../../src/errors/unallowed-filter.js';

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

describe('Filter Validator', () => {
  beforeEach(() =>  {
    queryParser = container.resolve(JsonApiQueryParserImpl);
  })

  it('Throw an error when filter is not true in schema', () => {
    const unallowedFilterError = new UnallowedFilterError("banane are not allowed as filter for articles", ['banane']);
    
    expect(() => queryParser.parse(`filter=${JSON.stringify({ banane : 1 })}`, 'articles')).toThrowError(unallowedFilterError);
  });

  it('to resolve successfully if filter is true in schema', () => {
    expect(() => queryParser.parse(`filter=${JSON.stringify({ banane : 1 })}`, 'example')).not.toThrowError();
  });
})
