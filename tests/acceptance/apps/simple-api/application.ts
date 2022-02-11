import 'reflect-metadata';
import createApplication from '../../../../src/index.js';
import { UsersController } from './controller.js';
import { DecoratorsController } from './decorators-controller.js';
import { MethodsController } from './methods-controller.js';
import Koa from 'koa';

export async function createDummyAcceptanceApp (port: number) {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    server: new Koa(),
    controllers: [UsersController, DecoratorsController, MethodsController],
    globalGuards: [],
    globalMiddlewares: [],
    baseRoute: '/api/v1'
  });

  const httpServer = koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    // console.log(`Listening on port ${port}`);
  });

  return httpServer;
}
