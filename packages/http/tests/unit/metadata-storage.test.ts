import 'reflect-metadata';
import { MetadataStorage } from '../../src/storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../../src/storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../../src/storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../../src/storages/metadata/use-response-handler.metadata.js';

describe('Metadata storage tests', () => {
  let metadataStorage: MetadataStorage;

  function makeParamFor (target: unknown, propertyName: string, index: number): UseParamsMetadataArgs {
    return {
      index,
      decoratorName: '',
      target,
      propertyName,
      handle: () => {},
      args: []
    }
  }

  function makeGuardFor (target: unknown, propertyName?: string): UseGuardMetadataArgs {
    return {
      target,
      guard: class {} as any,
      propertyName,
      args: []
    }
  }

  function makeResponseHandlerFor (target: unknown, propertyName?: string): UseResponseHandlerMetadataArgs {
    return {
      args: [],
      target,
      propertyName,
      responseHandler: class {} as any
    }
  }

  class TheTarget {
    public cmonDoSomething () {}
  }

  beforeEach(() => {
    metadataStorage = new MetadataStorage();
  })

  describe('Params', () => {
    it('gets sorted params for target property', () => {
      const firstParam = makeParamFor(TheTarget.prototype, 'cmonDoSomething', 0);
      const secondParam = makeParamFor(TheTarget.prototype, 'cmonDoSomething', 1);

      metadataStorage.useParams.push(secondParam, firstParam);

      expect(metadataStorage.sortedParametersForEndpoint(TheTarget, 'cmonDoSomething')).toStrictEqual([firstParam, secondParam]);
    });
    it('gets sorted params for target', () => {
      const firstParam = makeParamFor(TheTarget.prototype, 'aaa', 0);
      const secondParam = makeParamFor(TheTarget.prototype, 'bbb', 1);

      metadataStorage.useParams.push(secondParam, firstParam);

      expect(metadataStorage.sortedParametersForTarget(TheTarget)).toStrictEqual([firstParam, secondParam]);
    });
  });

  describe('Response handler', () => {
    it('endpoint level is chosen when defined', () => {
      const first = makeResponseHandlerFor(TheTarget.prototype, 'cmonDoSomething');
      const second = makeResponseHandlerFor(TheTarget);

      metadataStorage.useResponseHandlers.push(first, second);

      expect(metadataStorage.getClosestResponseHandlerForEndpoint(TheTarget, 'cmonDoSomething')).toStrictEqual(first);
    });
    it('router level is chosen when no endpoint response handler', () => {
      const first = makeResponseHandlerFor(TheTarget);

      metadataStorage.useResponseHandlers.push(first);

      expect(metadataStorage.getClosestResponseHandlerForEndpoint(TheTarget, 'cmonDoSomething')).toStrictEqual(first);
    });
    it('it returns undefined when no response handler is found', () => {
      expect(metadataStorage.getClosestResponseHandlerForEndpoint(TheTarget, 'cmonDoSomething')).toBeUndefined()
    })
  });
  describe('Guards', () => {
    it('gets reversed guards for target property', () => {
      const firstGuard = makeGuardFor(TheTarget.prototype, 'cmonDoSomething');
      const secondGuard = makeGuardFor(TheTarget);

      metadataStorage.useGuards.push(firstGuard, secondGuard);

      expect(metadataStorage.getGuardsForEndpoint(TheTarget, 'cmonDoSomething')).toStrictEqual([secondGuard, firstGuard]);
    });
  })
})
