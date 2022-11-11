import 'reflect-metadata';
import { createApplication } from '@triptyk/nfw-http';
import { UsersController } from './controllers/users.js';
import Koa from 'koa';
import koaQs from 'koa-qs';
import koaBody from 'koa-body';

export async function init () {
  const server = new Koa();

  koaQs(server);

  server.use(koaBody());

  await createApplication({
    controllers: [UsersController],
    server
  });

  server.listen(4200, () => {
    console.log(4200);
  });
}

init();
