import { init } from '@triptyk/nfw-mikro-orm';
import { container } from '@triptyk/nfw-core';
import { JsonApiRegistry } from '../../../src/jsonapi.registry.js';
import { ArticleModel } from './models/article.model.js';
import { CommentModel } from './models/comment.model.js';
import './resources/article.resource.js';
import './resources/comment.resource.js';

export async function initApp () {
  const orm = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [ArticleModel, CommentModel],
    allowGlobalContext: true
  });
  container.resolve(JsonApiRegistry).init({
    apiPath: '/api/v1'
  });

  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.updateSchema();

  const em = orm.em.fork();

  const article = em.create(ArticleModel, {
    id: 'article'
  });

  const comment = em.create(CommentModel, {
    id: 'comment',
    article
  });

  await em.persistAndFlush([article, comment]);
}
