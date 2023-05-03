/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */

import 'reflect-metadata';
import type { UseParamsMetadataArgs } from '../../../src/index.js';
import { ExecutableParam, ParamResolver } from '../../../src/index.js';
import { describe, expect, it, vi } from 'vitest';
import { ParamInterface } from '../../../src/interfaces/param.js';
import { container } from '@triptyk/nfw-core';

describe('ResolveParam', () => {
  class Controller {}
  const controllerInstance = new Controller();
  const args = { controllerAction: 'thing', controllerInstance };

  function constructParamResolver (handle : UseParamsMetadataArgs<unknown>['handle']) {
    return new ParamResolver(handle,args );
  }

  it('Resolves returns an instance of Executable Param', async () => {
    const handle = vi.fn(() => true);
    const resolver = constructParamResolver(handle);
    const result = resolver.resolve([]);

    expect(result).toBeInstanceOf(ExecutableParam);
  });

  it('Threats handler class as executable and resolves them', async () => {
    const spy = vi.spyOn(container,'resolve');
    const handle = vi.fn();
    
    class  ParamHandler implements  ParamInterface<unknown> {
      handle = handle
    }
    const resolver = constructParamResolver(ParamHandler);
    const result = resolver.resolve([]);

    expect(spy).toHaveBeenCalledWith(ParamHandler);

    expect(result).toBeInstanceOf(ExecutableParam);

    result.execute({} as never);
    expect(handle).toBeCalledWith({ ...args, ctx: {}});
    
    vi.resetAllMocks();
  });
});
