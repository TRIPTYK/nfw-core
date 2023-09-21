/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it, describe } from 'vitest';
import type { JsonApiQueryParser } from '../../../../src/query/parser.js';
import { JsonApiQueryParserImpl } from '../../../../src/query/parser.js';
import { ResourcesRegistryImpl } from '../../../../src/index.js';
import { UnknownRelationInSchemaError } from '../../../../src/errors/unknown-relation.js';

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
          sort: true,
          deserialize: true,
        },
      },
      relationships: {
        article: {
          serialize: true,
          deserialize: false,
          type: 'articles',
          cardinality: 'belongs-to',
        },
      },
    } as never,
  });
  resourcesRegistry.register('articles', {
    serializer: ExampleSerializer as never,
    deserializer: ExampleDeserializer as never,
    schema: {
      type: 'articles',
      attributes: {
        123: {
          serialize: true,
          sort: false,
          deserialize: true,
        },
      },
      relationships: {
        example: {
          serialize: true,
          deserialize: false,
          type: 'articles',
          cardinality: 'belongs-to',
        },
      },
    } as never,
  });
});

describe('Include Validator', () => {
  beforeEach(() => {
    queryParser = container.resolve(JsonApiQueryParserImpl);
  });

  const unknwownRelationError = new UnknownRelationInSchemaError('articles are not allowed for articles', [{ relationName: '', nested: [] }]);

  it('Throw an error when include is not in relations list', () => {
    expect(() => queryParser.parse('include=articles', 'articles')).toThrowError(unknwownRelationError);
  });

  it('to resolve successfully if all include are in relations list', () => {
    expect(() => queryParser.parse('include=article', 'example')).not.toThrowError();
  });

  describe('Nested', () => {
    it('Throw an error when include is not in relations list', () => {
      expect(() => queryParser.parse('include=article,article.articles', 'example')).toThrowError(unknwownRelationError);
    });

    it('to resolve successfully if all include are in relations list', () => {
      expect(() => queryParser.parse('include=article,article.example', 'example')).not.toThrowError();
    });
  });
});
