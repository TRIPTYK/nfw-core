import 'reflect-metadata';
import { JsonApiMethod, JsonApiRegistry, QueryParser } from '../../src/index.js';
import { container } from '@triptyk/nfw-core';
import { MikroORM } from '@mikro-orm/core';
import { test, expect, beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
  const { initApp } = await import('./dummy-app/init.js');
  await initApp();
});

// eslint-disable-next-line max-statements
test('parses filters request', async () => {
  const parser = new QueryParser();
  const registry = container.resolve(JsonApiRegistry);

  const resource = registry.getResourceByClassName('ArticleResource')!;

  parser.context = {
    resource,
    koaContext: undefined as any,
    method: JsonApiMethod.GET
  };

  const parsed = await parser.parse({
    include: 'comments',
    filter: {
      $and: [
        {
          $or: [{ comments: { id: { $eq: 'category6' } } }]
        }
      ]
    }
  });

  expect(parsed.includes.size).toStrictEqual(1);
  expect(parsed.filters.logical).toStrictEqual('$and');

  let [nested] = Array.from(parsed.filters.nested.values());

  expect(nested.logical).toStrictEqual('$and');

  [nested] = Array.from(nested.nested.values());

  expect(nested.logical).toStrictEqual('$or');
});

// eslint-disable-next-line max-statements
test('parses deep nested include request', async () => {
  const parser = new QueryParser();
  const registry = container.resolve(JsonApiRegistry);

  const resource = registry.getResourceByClassName('ArticleResource')!;

  parser.context = {
    resource,
    koaContext: undefined as any,
    method: JsonApiMethod.GET
  };

  const parsed = await parser.parse({
    include: 'comments,comments.locales,comments.locales.comment,comments.article'
  });

  expect(parsed.includes.size).toStrictEqual(1);
  expect(parsed.includes.get('comments')!.includes.size).toStrictEqual(2);
  expect(parsed.includes.get('comments')!.includes.get('article')?.includes.size).toStrictEqual(0);
  expect(parsed.includes.get('comments')!.includes.get('locales')?.includes.size).toStrictEqual(1);
});

afterEach(async () => {
  await container.resolve(MikroORM).close(true);
});
