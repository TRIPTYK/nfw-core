/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */

import 'reflect-metadata';
import type { UseParamsMetadataArgs } from '../../../src/index.js';
import { ExecutableParam, ParamResolver } from '../../../src/index.js';
import { describe, expect, it, vi } from 'vitest';

describe('ResolveParam', () => {
  class Controller {}
  const controllerInstance = new Controller();

  function constructParamResolver (handle : UseParamsMetadataArgs['handle']) {
    return new ParamResolver(handle, { controllerAction: 'thing', controllerInstance });
  }

  it('Resolves returns an instance of Executable Param', async () => {
    const handle = vi.fn(() => true);
    const resolver = constructParamResolver(handle);
    const result = resolver.resolve([]);

    expect(result).toBeInstanceOf(ExecutableParam);
  });
});
