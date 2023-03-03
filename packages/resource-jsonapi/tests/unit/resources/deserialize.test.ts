
import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from 'resources';
import { test, expect, beforeEach } from 'vitest';
import { JsonApiRegistryImpl } from '../../../src/registry/registry.js';
import { ArticleResource, registerArticle } from '../../samples/article.js';
import { registerUser, UserResource } from '../../samples/user.js';

let registry : ResourcesRegistry;

beforeEach(async () => {
  registry = container.resolve(JsonApiRegistryImpl);
  registerArticle(registry);
  registerUser(registry);
});

const payload = {
  data: {
    type: 'article',
    attributes: {
      name: 'Ember Hamster'
    },
    relationships: {
      writer: {
        data: { type: 'user', id: '9' }
      }
    }
  }
};

test('It transforms a jsonapi payload into a resource and populates nested resources', async () => {
  const deserializer = registry.get('article').deserializer;

  const deserialized = await deserializer.deserialize(payload) as ArticleResource;

  expect(deserialized).toBeInstanceOf(ArticleResource);
  expect(deserialized.id).toBe(undefined);
  expect(deserialized.writer).toBeInstanceOf(UserResource);
  expect(deserialized.writer.id).toBe('9');
});
