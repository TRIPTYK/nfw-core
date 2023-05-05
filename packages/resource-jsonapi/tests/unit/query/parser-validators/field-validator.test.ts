import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, expect, it, describe } from 'vitest';
import { JsonApiQueryParser, JsonApiQueryParserImpl } from '../../../../src/query/parser.js';
import { ResourcesRegistryImpl, UnknownFieldInSchemaError } from '../../../../src';

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

describe('Fields Validator', () => {
  beforeEach(() =>  {
    queryParser = container.resolve(JsonApiQueryParserImpl);
  })

  it('Throw an error when field is not in attributes', () => {
  const unknwonFieldError = new UnknownFieldInSchemaError("123 are not allowed for example", ["123"])
    expect(() => queryParser.parse('fields[example]=123', 'example')).toThrowError(unknwonFieldError);
  });

  it('To resolve successfully if all fields are in attributes', () => {
    expect(() => queryParser.parse('fields[articles]=123', 'example')).not.toThrowError();
  });
})

