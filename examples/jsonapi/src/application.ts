import 'reflect-metadata';
import createApplication, { container } from '@triptyk/nfw-core';
import Koa from 'koa';
import { Area } from './area.js';
import { init } from '@triptyk/nfw-mikro-orm';
import { UserModel } from './models/user.model.js';
import { ArticleModel } from './models/article.model.js';
import { JsonApiRegistry } from '@triptyk/nfw-jsonapi';
import './resources/article.resource.js';

async function main () {
  const mikro = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [UserModel, ArticleModel]
  });

  await container.resolve(JsonApiRegistry).init();
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

  em.persistAndFlush(user);

  /**
   * Create the app
   */
  const koaApp = await createApplication({
    server: new Koa(),
    controllers: [Area]
  });

  const port = 8001;

  koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
}

main();
