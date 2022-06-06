import 'reflect-metadata';
import createApplication from '../../../../src/index.js';
import Koa from 'koa';
import { MainArea } from './areas/area.js';

export async function createDummyAcceptanceApp (port: number) {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    server: new Koa(),
    controllers: [
      MainArea
    ]
  });

  const httpServer = koaApp.listen(port, () => {
    // eslint-disable-next-line no-console
    // console.log(`Listening on port ${port}`);
  });

  return httpServer;
}
