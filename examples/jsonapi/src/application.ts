import 'reflect-metadata';
import createApplication, { container } from '@triptyk/nfw-core';
import Koa from 'koa';
import body from 'koa-body';
import { Area } from './area.js';
import { init } from '@triptyk/nfw-mikro-orm';
import { UserModel } from './models/user.model.js';
import { ArticleModel } from './models/article.model.js';
import { JsonApiRegistry } from '@triptyk/nfw-jsonapi';
import './resources/article.resource.js';
import koaQs from 'koa-qs';

async function main () {
  const mikro = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [UserModel, ArticleModel],
    debug: true
  });

  await container.resolve(JsonApiRegistry).init({
    apiPath: '/api/v1'
  });
  await mikro.getSchemaGenerator().updateSchema();

  const em = mikro.em.fork();

  const user = em.getRepository(UserModel).create({
    id: '12',
    username: 'Amaury',
    articles: [
      em.getRepository(ArticleModel).create({
        id: 'ccccccc',
        title: 'ccc'
      } as any),
      em.getRepository(ArticleModel).create({
        id: 'bbbbbbb',
        title: 'bbbb'
      } as any),
      em.getRepository(ArticleModel).create({
        id: 'aaaaaaa',
        title: 'aaaa'
      } as any)
    ]
  });
  const seb = em.getRepository(UserModel).create({
    id: '2',
    username: 'seb',
    articles: [
      em.getRepository(ArticleModel).create({
        id: 'ddddd',
        title: 'ddddddd'
      } as any)
    ]
  });

  em.persistAndFlush([user, seb]);

  const server = new Koa();
  server.use(body({
    json: true
  }));

  /**
   * Create the app
   */
  const koaApp = await createApplication({
    server,
    controllers: [Area]
  });

  koaQs(koaApp, 'extended');

  const port = 8000;

  koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
}

main();
