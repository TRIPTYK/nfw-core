/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */

import 'reflect-metadata';
import { ControllerActionBuilder } from '../../../src/routing/controller-action.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';
import { createKoaContext } from '../../mocks/koa-context.js';
import type { GuardInterface, ResponseHandlerInterface } from '../../../src/index.js';
import { GuardResolver, ResponseHandlerResolver } from '../../../src/index.js';
import { ForbiddenError } from '../../../src/errors/forbidden.js';
import { ControllerActionResolver } from '../../../src/resolvers/controller-action-resolver.js';
import { describe, expect, beforeEach, it, vi } from 'vitest';
import type { ControllerContextType } from '../../../src/types/controller-context.js';

describe('Action builder', () => {
  let instance: Controller;
  let storage : MetadataStorage;
  let actionBuilder : ControllerActionBuilder;

  const listFn = vi.fn(() => 'waw');
  class Controller {
    public list = listFn;
  }

  function createControllerContext () {
    return {
      controllerAction: 'list',
      controllerInstance: instance,
    };
  }

  function createActionBuilder (controllerContext: ControllerContextType) {
    const actionResolver = new ControllerActionResolver(storage, controllerContext);
    const guardResolver = new GuardResolver(storage, controllerContext);
    const responseHandlerResolver = new ResponseHandlerResolver(storage, controllerContext);

    return new ControllerActionBuilder(
      guardResolver,
      responseHandlerResolver,
      actionResolver,
    );
  }

  beforeEach(() => {
    instance = new Controller();
    storage = new MetadataStorage();
    actionBuilder = createActionBuilder(createControllerContext());
  });

  it('Builds a middleware that executes controller action', async () => {
    const next = vi.fn(async () => {});

    const actionMiddleware = actionBuilder.build();
    await actionMiddleware(createKoaContext(), next);

    expect(listFn).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(0);
  });

  it('Triggers response handler when defined', async () => {
    const handle = vi.fn(async () => {});

    class ResponseHandler implements ResponseHandlerInterface {
      public handle = handle;
    };

    storage.useResponseHandlers.push({
      target: Controller.prototype,
      propertyName: 'list',
      args: [],
      responseHandler: ResponseHandler,
    });

    const actionMiddleware = actionBuilder.build();

    await actionMiddleware(createKoaContext(), async () => {});

    expect(handle).toBeCalledTimes(1);
    expect(handle).toBeCalledWith('waw');
  });
  describe('Guard', () => {
    function buildGuardClass (handle: GuardInterface['can']) {
      return class Guard implements GuardInterface {
        public can = handle;
      };
    }

    it('Triggers guards', async () => {
      const canHandle = vi.fn(async () => true);
      const Guard = buildGuardClass(canHandle);

      storage.useGuards.push({
        target: Controller.prototype,
        propertyName: 'list',
        args: [],
        guard: Guard,
      });

      const actionMiddleware = actionBuilder.build();
      await actionMiddleware(createKoaContext(), async () => {});
      expect(canHandle).toBeCalledTimes(1);
    });
    it('Throws exception when any guard fails', async () => {
      const canHandle = vi.fn(async () => false);
      const Guard = buildGuardClass(canHandle);

      storage.useGuards.push({
        target: Controller.prototype,
        propertyName: 'list',
        args: [],
        guard: Guard,
      });

      const actionMiddleware = actionBuilder.build();
      expect(() => actionMiddleware(createKoaContext(), async () => {})).rejects.toThrowError(ForbiddenError);
    });
  });
});
