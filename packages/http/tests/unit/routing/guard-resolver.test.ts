/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata';
import type { Class } from 'type-fest';
import type { GuardInterface } from '../../../src/interfaces/guard.js';
import { ExecutableGuard } from '../../../src/routing/executable-guard.js';
import { GuardResolver } from '../../../src/routing/guard-resolver.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';

describe('Guard builder', () => {
  class Controller {}
  class Guard implements GuardInterface {
  // eslint-disable-next-line class-methods-use-this
    public can (): boolean {
      return true;
    }
  }

  function setupGuardMetaInStorage (Controller: Class<Controller>, Guard: Class<Guard>, storage: MetadataStorage) {
    const meta = {
      target: Controller,
      guard: Guard,
      args: ['blah']
    };

    storage.useGuards.push(meta);
    return meta;
  }

  test('It returns an executableGuard instance', () => {
    const storage = new MetadataStorage();
    const meta = setupGuardMetaInStorage(Controller, Guard, storage);

    const guardBuilder = new GuardResolver(
      storage,
      {
        controllerAction: 'nona',
        controllerInstance: new class {}()
      }
    );
    const resolved = guardBuilder.resolve(meta);

    expect(resolved).toBeInstanceOf(ExecutableGuard);
  });
});
