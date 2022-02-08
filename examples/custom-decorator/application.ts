import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import { UsersController } from './controller/user.controller.js';
import { MikroORM } from '@mikro-orm/core';
import { UserModel } from './model/user.model.js';

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
    controllers: [UsersController],
    globalGuards: [],
    mikroORMConnection: orm,
    globalMiddlewares: [],
    baseRoute: '/api/v1'
  });

  const port = 8001;

  koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
}

init();
