import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import Koa from 'koa';
import { Area } from './area.js';
import { init } from '@triptyk/nfw-core-mikro-orm';
import { UserModel } from './models/user.model.js';

async function main () {
  const mikro = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [UserModel]
  });

  await mikro.getSchemaGenerator().updateSchema();

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
