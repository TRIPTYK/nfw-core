import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it, describe } from 'vitest';
import {  ResourcesRegistryImpl, UnknownFieldInSchemaError } from '../../../src/index.js';
import type { JsonApiQueryParser } from '../../../src/query/parser.js';
import { JsonApiQueryParserImpl } from '../../../src/query/parser.js';
import { UnknownRelationInSchemaError } from '../../../src/errors/unknown-relation.js';

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

describe('Fields', () => {
  it('Throw an error when field is not in attributes', () => {
  const unknwonFieldError = new UnknownFieldInSchemaError("123 are not allowed for example", ["123"])
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('fields[example]=123', 'example')).toThrowError(unknwonFieldError);
  });

  it('To resolve successfully if all fields are in attributes', () => {
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('fields[articles]=123', 'example')).not.toThrowError();
  });
})


describe('Include', () => {
  const unknwownRelationError = new UnknownRelationInSchemaError("articles are not allowed for articles", [{ relationName: '', nested: []}]);

  it('Throw an error when include is not in relations list', () => {
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('include=articles', 'articles')).toThrowError(unknwownRelationError);
  });

  it('to resolve successfully if all include are in relations list', () => {
    queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
    expect(() => queryParser.parse('include=articles', 'example')).not.toThrowError();
  });

  describe('Nested', () => {
    it('Throw an error when include is not in relations list', () => {
      queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
      expect(() => queryParser.parse('include=articles,articles.articles', 'example')).toThrowError(unknwownRelationError);
    });

    it('to resolve successfully if all include are in relations list', () => {
      queryParser = new JsonApiQueryParserImpl(resourcesRegistry);
      expect(() => queryParser.parse('include=articles,articles.example', 'example')).not.toThrowError();
    });
  })
})
