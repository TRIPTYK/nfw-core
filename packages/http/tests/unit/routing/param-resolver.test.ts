/* eslint-disable max-statements */

import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import type { UseParamsMetadataArgs } from '../../../src/index.js';
import { jest, describe, expect, it } from '@jest/globals';
import { ParamResolver } from '../../../src/routing/param-resolver.js';

describe('ResolveParam', () => {
  class Controller {}
  class MyThing {
    public thing () {}
  }
  const controllerInstance = new Controller();

  function makeMeta (handle: UseParamsMetadataArgs['handle']): UseParamsMetadataArgs {
    return {
      decoratorName: 'controller-context',
      target: MyThing,
      propertyName: 'thing',
      index: 0,
      handle,
      args: []
    };
  }

  function constructParamResolver (handle : UseParamsMetadataArgs['handle']) {
    const paramMeta = makeMeta(handle);
    return new ParamResolver(paramMeta, 'thing', controllerInstance);
  }

  it('Resolve a param and executes the handle', async () => {
    const handle = jest.fn(() => true);
    const resolver = constructParamResolver(handle);
    const result = await resolver.handleParam([], {} as RouterContext);

    expect(result).toStrictEqual(true);
    expect(handle).toBeCalledTimes(1);
  });
  it('Returns controller-context on special controller-context param', async () => {
    const resolver = constructParamResolver('controller-context');
    const result = await resolver.handleParam([], {} as RouterContext);
    expect(result).toStrictEqual({ controllerAction: 'thing', controllerInstance });
  });
  it('Returns context args on special args param', async () => {
    const resolver = constructParamResolver('args');
    const result = await resolver.handleParam(['a'], {} as RouterContext);
    expect(result).toStrictEqual(['a']);
  });
});
