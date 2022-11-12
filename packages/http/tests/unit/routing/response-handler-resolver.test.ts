/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata';
import type { Class } from 'type-fest';
import type { ResponseHandlerInterface } from '../../../src/index.js';
import { ResponseHandlerResolver } from '../../../src/routing/response-handler-resolver.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';

describe('Response Handler resolver', () => {
  class Controller {}
  class ResponseHandler implements ResponseHandlerInterface {
  // eslint-disable-next-line class-methods-use-this
    public handle (): void {}
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

  function setupParamsMetaInStorage (Guard: Class<ResponseHandler>, storage: MetadataStorage) {
    const useParamsMeta = {
      target: Guard.prototype,
      propertyName: 'can',
      args: [],
      decoratorName: '',
      index: 0,
      handle: () => { }
    };

    storage.useParams.push(useParamsMeta);
    return useParamsMeta;
  }

  test('It returns resolved guard instance, params and args', () => {
    const storage = new MetadataStorage();
    const meta = setupGuardMetaInStorage(Controller, ResponseHandler, storage);
    const useParamsMeta = setupParamsMetaInStorage(ResponseHandler, storage);

    const resolver = new ResponseHandlerResolver(
      storage
    );
    const resolved = resolver.resolve(meta);

    expect(resolved.instance).toBeInstanceOf(ResponseHandler);
    expect(resolved.args).toStrictEqual(['blah']);
    expect(resolved.paramsMeta).toStrictEqual([useParamsMeta]);
  });
});
