/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata';
import type { Class } from 'type-fest';
import type { ResponseHandlerInterface } from '../../../src/index.js';
import { ExecutableResponseHandler } from '../../../src/routing/executable-response-handler.js';
import { ResponseHandlerResolver } from '../../../src/routing/response-handler-resolver.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';

describe('Response handler resolver', () => {
  class Controller {}
  class ResponseHandler implements ResponseHandlerInterface {
  // eslint-disable-next-line class-methods-use-this
    public handle () {}
  }

  function setupGuardMetaInStorage (Controller: Class<Controller>, responseHandler: Class<ResponseHandler>, storage: MetadataStorage) {
    const meta = {
      target: Controller,
      responseHandler,
      args: ['blah']
    };

    storage.useResponseHandlers.push(meta);
    return meta;
  }

  test('It returns an executableGuard instance', () => {
    const storage = new MetadataStorage();
    const meta = setupGuardMetaInStorage(Controller, ResponseHandler, storage);

    const guardBuilder = new ResponseHandlerResolver(
      storage,
      {
        controllerAction: 'nona',
        controllerInstance: new class {}()
      }
    );
    const resolved = guardBuilder.resolve(meta);

    expect(resolved).toBeInstanceOf(ExecutableResponseHandler);
  });
});
