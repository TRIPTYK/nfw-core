import 'reflect-metadata';
import { createApplication } from '@triptyk/nfw-http';
import { UsersController } from './controllers/users.js';
import Koa from 'koa';
import koaQs from 'koa-qs';
import { koaBody } from 'koa-body';
import { init } from '@triptyk/nfw-mikro-orm';
import { UserModel } from './models/user.model.js';

// eslint-disable-next-line max-statements
export async function initHTTP () {
  const orm = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [UserModel],
    allowGlobalContext: true
  });

  await orm.getSchemaGenerator().refreshDatabase();

  orm.em.insertMany(UserModel, [
    {
      name: 'amaury'
    }
  ]);

  const server = new Koa();

  koaQs(server);

  server.use(koaBody());

  await createApplication({
    controllers: [UsersController],
    server
  });

  server.listen(4200, () => {
    console.log('http://localhost:4200');
  });
}

initHTTP();
