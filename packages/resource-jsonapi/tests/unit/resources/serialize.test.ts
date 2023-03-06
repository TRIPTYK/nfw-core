/* eslint-disable unicorn/no-null */
import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from 'resources';
import { beforeEach, test, expect } from 'vitest';
import { JsonApiRegistryImpl } from '../../../src/registry/registry.js';
import { registerArticle } from '../../samples/article.js';
import { registerUser } from '../../samples/user.js';

let registry : ResourcesRegistry;

beforeEach(async () => {
  registry = container.resolve(JsonApiRegistryImpl);
  registerArticle(registry);
  registerUser(registry);
});

test('serializes a resource', async () => {
  const serializer = registry.get('article').serializer;

  const resource = await registry.get('article').factory.create({
    name: '123',
    writer: {
      id: '123',
      name: 'amaury'
    }
  });

  const serialized = await serializer.serialize(resource);

  expect(serialized).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: undefined,
    data: {
      type: 'article',
      id: undefined,
      attributes: { name: '123' },
      relationships: {
        writer: {
          data: {
            id: '123',
            type: 'user'
          },
          links: undefined,
          meta: undefined
        }
      },
      meta: undefined,
      links: undefined
    },
    included: [
      {
        type: 'user',
        id: '123',
        attributes: { name: 'amaury' },
        relationships: undefined,
        meta: undefined,
        links: undefined
      }
    ]
  });
});

test('serializes many resources', async () => {
  const serializer = registry.get('article').serializer;

  const resource = await registry.get('article').factory.create({
    name: '123',
    writer: {
      id: '123',
      name: 'amaury'
    }
  });

  const serialized = await serializer.serializeMany([resource]);

  expect(serialized).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: undefined,
    data: [{
      type: 'article',
      id: undefined,
      attributes: { name: '123' },
      relationships: {
        writer: {
          data: {
            id: '123',
            type: 'user'
          },
          links: undefined,
          meta: undefined
        }
      },
      meta: undefined,
      links: undefined
    }],
    included: [
      {
        type: 'user',
        id: '123',
        attributes: { name: 'amaury' },
        relationships: undefined,
        meta: undefined,
        links: undefined
      }
    ]
  });
});
