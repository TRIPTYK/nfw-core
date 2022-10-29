
import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import type { UseParamsMetadataArgs } from '../../../src/index.js';
import { handleParam } from '../../../src/routing/controller-action.js'
import { jest } from '@jest/globals';

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

  it('Resolve a param and executes the handle', async () => {
    const handle = jest.fn(() => true);
    const paramMeta = makeMeta(handle);
    const result = await handleParam(paramMeta, [], 'thing', controllerInstance, {} as RouterContext);

    expect(result).toStrictEqual(true);
    expect(handle).toBeCalledTimes(1);
  });
  it('Returns controller-context on special controller-context param', async () => {
    const paramMeta = makeMeta('controller-context');
    const result = await handleParam(paramMeta, [], 'thing', controllerInstance, {} as RouterContext);
    expect(result).toStrictEqual({ controllerAction: 'thing', controllerInstance });
  });
  it('Returns context args on special args param', async () => {
    const paramMeta = makeMeta('args');
    const result = await handleParam(paramMeta, ['a'], 'thing', controllerInstance, {} as RouterContext);
    expect(result).toStrictEqual(['a']);
  });
})
