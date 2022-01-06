import 'reflect-metadata';
import createApplication from '../../../../src/index.js';
import { UsersController } from './controller.js';

export async function createDummyAcceptanceApp (port: number) {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    controllers: [UsersController],
    globalGuards: [],
    globalMiddlewares: [],
    baseRoute: '/api/v1'
  });

  const httpServer = koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });

  return httpServer;
}
