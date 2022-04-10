import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import Koa from 'koa';
import { MainArea } from './area.js';

async function init () {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    server: new Koa(),
    areas: [MainArea],
    globalGuards: [],
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
