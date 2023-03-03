import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from 'resources';
import { beforeEach, it } from 'vitest';
import { JsonApiRegistryImpl } from '../../src/registry/registry.js';
import type { ArticleAdapter, ArticleResource } from '../samples/article.js';
import { registerArticle } from '../samples/article.js';
import { registerUser } from '../samples/user.js';

const clientPayload = {
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

let registry : ResourcesRegistry;

beforeEach(async () => {
  registry = container.resolve(JsonApiRegistryImpl);
  registerArticle(registry);
  registerUser(registry);
});

it('makes a complete flow for creating a resource', async () => {
  const { deserializer, serializer, adapter } = registry.get<ArticleResource>('article');

  const resource = await deserializer.deserialize(clientPayload);
  await resource.validate();

  await (adapter as ArticleAdapter).create();

  return serializer.serialize(resource);
});
