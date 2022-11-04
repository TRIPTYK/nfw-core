/* eslint-disable max-statements */
import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { ResourceService } from '../../src/index.js';
import { QueryParser, JsonApiMethod } from '../../src/index.js';
import { JsonApiRegistry } from '../../src/jsonapi.registry.js';
import type { ArticleModel } from './dummy-app/models/article.model.js';
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
          comments: {
            id: {
              $like: '%gil%'
            },
            title: {
              $eq: 'fr-fr'
            }
          }
        }
      ]
    }
  });
  const service = container.resolve('service:article') as ResourceService<ArticleModel>;
  const filters = service.applyFilter(parsed.filters, {});

  expect(filters).toStrictEqual({
    $and: [
      {
        $and: [

          { comments: { id: { $like: '%gil%' }, title: { $eq: 'fr-fr' } } }

        ]
      }
    ]
  });
  // {"$and":[{"$and":[{"locales":{"label":{"$like":"%gil%"}}},{"locales":{"locale":{"$eq":"fr-fr"}}}]}]}
  // {"$and":[{"locales":{"label":{"$like":"%gil%"},"locale":{"$eq":"fr-fr"}}}]}
});

afterEach(async () => {
  await container.resolve(MikroORM).close(true);
});
