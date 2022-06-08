import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import Koa from 'koa';
import { Area } from './area.js';

async function init () {
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

init();
