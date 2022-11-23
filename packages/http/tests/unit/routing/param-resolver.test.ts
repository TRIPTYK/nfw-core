/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */

import 'reflect-metadata';
import type { UseParamsMetadataArgs } from '../../../src/index.js';
import { ExecutableParam, ParamResolver } from '../../../src/index.js';
import { jest, describe, expect, it } from '@jest/globals';

describe('ResolveParam', () => {
  class Controller {}
  const controllerInstance = new Controller();

  function constructParamResolver (handle : UseParamsMetadataArgs['handle']) {
    return new ParamResolver(handle, { controllerAction: 'thing', controllerInstance });
  }

  it('Resolves returns an instance of Executable Param', async () => {
    const handle = jest.fn(() => true);
    const resolver = constructParamResolver(handle);
    const result = resolver.resolve([]);

    expect(result).toBeInstanceOf(ExecutableParam);
  });
});
