import 'reflect-metadata';
import createApplication from '@triptyk/nfw-core';
import { UsersController } from './controller.js';

async function init () {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    controllers: [UsersController],
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
