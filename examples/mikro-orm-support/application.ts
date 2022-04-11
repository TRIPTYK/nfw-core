import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import { MikroORM } from '@mikro-orm/core';
import { UserModel } from './model/user.model.js';
import koaBody from 'koa-body';
import Koa from 'koa';
import { MainArea } from './area/main.area.js';

async function init () {
  const orm = await MikroORM.init({
    entities: [UserModel],
    dbName: ':memory:',
    type: 'sqlite'
  });

  const gen = orm.getSchemaGenerator();
  await gen.dropSchema();
  await gen.createSchema();

  const user = new UserModel();
  user.username = 'amaury';
  user.id = 'abcdef';

  await orm.em.fork().persistAndFlush(user);

  /**
   * Create the app
   */
  const koaApp = await createApplication({
    areas: [MainArea],
    server: new Koa(),
    globalGuards: [],
    mikroORMConnection: orm,
    globalMiddlewares: [
      koaBody()
    ],
    baseRoute: '/api/v1'
  });

  const port = 8002;

  koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
}

init();
