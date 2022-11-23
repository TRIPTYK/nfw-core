/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata';
import type { Class } from 'type-fest';
import { ExecutableGuard } from '../../../src/executables/executable-guard.js';
import type { GuardInterface } from '../../../src/interfaces/guard.js';
import { GuardResolver } from '../../../src/resolvers/guard-resolver.js';

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
    setupGuardMetaInStorage(Controller, Guard, storage);

    const guardBuilder = new GuardResolver(
      storage,
      {
        controllerAction: 'nona',
        controllerInstance: new Controller()
      }
    );
    const resolved = guardBuilder.resolve();

    expect(resolved).toBeInstanceOf(Array);
    expect(resolved.length).toStrictEqual(1);
    for (const guard of resolved) {
      expect(guard).toBeInstanceOf(ExecutableGuard);
    }
  });
});
