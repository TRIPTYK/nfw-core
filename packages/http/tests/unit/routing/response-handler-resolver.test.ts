/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata';
import type { Class } from 'type-fest';
import type { MetadataStorageInterface, ResponseHandlerInterface } from '../../../src/index.js';
import { ExecutableResponseHandler } from '../../../src/routing/executable-response-handler.js';
import { ResponseHandlerResolver } from '../../../src/routing/response-handler-resolver.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';

describe('Response handler resolver', () => {
  let storage: MetadataStorageInterface;

  class Controller {}
  class ResponseHandler implements ResponseHandlerInterface {
  // eslint-disable-next-line class-methods-use-this
    public handle () {}
  }

  function setupResponseHandlerMetaInStorage (Controller: Class<Controller>, responseHandler: Class<ResponseHandler>, storage: MetadataStorageInterface) {
    const meta = {
      target: Controller,
      responseHandler,
      args: ['blah']
    };

    storage.addResponseHandlerUsage(meta);
    return meta;
  }

  function createResolver () {
    return new ResponseHandlerResolver(
      storage,
      {
        controllerAction: 'nona',
        controllerInstance: new Controller()
      }
    );
  }

  beforeEach(() => {
    storage = new MetadataStorage();
  });

  test('It returns an executableResponseHandler instance when response-handler is in the storage', () => {
    setupResponseHandlerMetaInStorage(Controller, ResponseHandler, storage);
    const responseHandlerResolver = createResolver();
    const resolved = responseHandlerResolver.resolve();

    expect(resolved).toBeInstanceOf(ExecutableResponseHandler);
  });

  test('It returns undefined when nothing is in storage', () => {
    const responseHandlerResolver = createResolver();
    const resolved = responseHandlerResolver.resolve();
    expect(resolved).toBeUndefined();
  });
});
