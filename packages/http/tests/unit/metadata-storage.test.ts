/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
import 'reflect-metadata';
import { MetadataStorage } from '../../src/storages/metadata-storage.js';
import type { UseGuardMetadataArgs } from '../../src/storages/metadata/use-guard.js';
import type { UseParamsMetadataArgs } from '../../src/storages/metadata/use-param.js';
import type { UseResponseHandlerMetadataArgs } from '../../src/storages/metadata/use-response-handler.js';
import { describe, expect, beforeEach, it } from 'vitest';
import { RouterMetadataNotFoundError } from '../../src/errors/router-metadata-not-found.js';
import type { RouteMetadataArgs, UseMiddlewareMetadataArgs } from '../../src/index.js';
import type { Class } from 'type-fest';

describe('Metadata storage tests', () => {
  let metadataStorage: MetadataStorage;

  function makeParamFor (target: unknown, propertyName: string, index: number): UseParamsMetadataArgs<unknown> {
    return {
      index,
      decoratorName: '',
      target,
      propertyName,
      handle: () => {},
      args: []
    };
  }

  function makeGuardFor (target: unknown, propertyName?: string): UseGuardMetadataArgs {
    return {
      target,
      guard: class {} as never,
      propertyName,
      args: []
    };
  }

  function makeResponseHandlerFor (target: unknown, propertyName?: string): UseResponseHandlerMetadataArgs {
    return {
      args: [],
      target,
      propertyName,
      responseHandler: class {} as never
    };
  }

  function makeRouterFor (target: Class<unknown>): RouteMetadataArgs<unknown> {
    return {
      target,
      controllers: [],
      args: [],
      builder: class {} as never
    };
  }

  function makeMiddlewareUsageFor (target: Class<unknown>, type: 'before' | 'after'): UseMiddlewareMetadataArgs {
    return {
      target,
      middleware: {} as never,
      type
    } satisfies UseMiddlewareMetadataArgs;
  }

  class TheTarget {
    // eslint-disable-next-line class-methods-use-this
    public cmonDoSomething () {}
  }

  beforeEach(() => {
    metadataStorage = new MetadataStorage();
  });

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
    it('addParamUsage pushes into storage array', () => {
      const param = makeParamFor(TheTarget.prototype, 'aaa', 0);
      metadataStorage.addParamUsage(param);
      expect(metadataStorage.useParams.some((r) => r === param)).toStrictEqual(true);
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
      expect(metadataStorage.getClosestResponseHandlerForEndpoint(TheTarget, 'cmonDoSomething')).toBeUndefined();
    });
    it('addResponseHandlerUsage pushes into storage array', () => {
      const handler = makeResponseHandlerFor(TheTarget);
      metadataStorage.addResponseHandlerUsage(handler);
      expect(metadataStorage.useResponseHandlers.some((r) => r === handler)).toStrictEqual(true);
    });
  });
  describe('Guards', () => {
    it('gets reversed guards for target property', () => {
      const firstGuard = makeGuardFor(TheTarget.prototype, 'cmonDoSomething');
      const secondGuard = makeGuardFor(TheTarget);

      metadataStorage.useGuards.push(firstGuard, secondGuard);

      expect(metadataStorage.getGuardsForEndpoint(TheTarget, 'cmonDoSomething')).toStrictEqual([secondGuard, firstGuard]);
    });
    it('addGuardUsage pushes into storage array', () => {
      const handler = makeGuardFor(TheTarget);
      metadataStorage.addGuardUsage(handler);
      expect(metadataStorage.useGuards.some((r) => r === handler)).toStrictEqual(true);
    });
  });
  describe('Router', () => {
    it('Throws error when no route metadata is found for target', () => {
      expect(() => metadataStorage.findRouteForTarget(class {})).toThrowError(RouterMetadataNotFoundError);
    });
    it('Retreives correct metadata from target', () => {
      const routeMeta = makeRouterFor(TheTarget);
      metadataStorage.routes.push(routeMeta);
      expect(metadataStorage.findRouteForTarget(TheTarget)).toStrictEqual(routeMeta);
    });
    it('addRouter pushes into storage array', () => {
      const handler = makeRouterFor(TheTarget);
      metadataStorage.addRouter(handler);
      expect(metadataStorage.routes.some((r) => r === handler)).toStrictEqual(true);
    });
  });
  describe('Middlewares', () => {
    it('Gets before middlewares for target', () => {
      makeMiddlewareUsageFor(TheTarget, 'after');
      const middlewareMeta = makeMiddlewareUsageFor(TheTarget, 'before');
      metadataStorage.useMiddlewares.push(middlewareMeta);
      expect(metadataStorage.getBeforeMiddlewaresForTarget(TheTarget)).toStrictEqual([middlewareMeta]);
    });
    it('Gets after middlewares for target', () => {
      makeMiddlewareUsageFor(TheTarget, 'before');
      const middlewareMeta = makeMiddlewareUsageFor(TheTarget, 'after');
      metadataStorage.useMiddlewares.push(middlewareMeta);
      expect(metadataStorage.getAfterMiddlewaresForTarget(TheTarget)).toStrictEqual([middlewareMeta]);
    });
  });
});
