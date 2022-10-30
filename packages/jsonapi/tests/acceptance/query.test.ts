import 'reflect-metadata';
import { JsonApiMethod, JsonApiRegistry, QueryParser } from '../../src/index.js';
import { container } from '@triptyk/nfw-core';
import { MikroORM } from '@mikro-orm/core';

beforeEach(async () => {
  const { initApp } = await import('./dummy-app/init.js');
  await initApp();
});

test('parses request', async () => {
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

afterEach(async () => {
  await container.resolve(MikroORM).close(true);
});
