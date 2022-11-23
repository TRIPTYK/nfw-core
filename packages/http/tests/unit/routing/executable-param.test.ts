/* eslint-disable max-statements */
import type { RouterContext } from '@koa/router';
import type { ControllerContextType } from '../../../src/types/controller-context.js';
import { jest } from '@jest/globals';
import type { ControllerParamsContext } from '../../../src/index.js';
import { ExecutableParam } from '../../../src/index.js';
import type { ResolvedParamType } from '../../../src/types/resolved-param.js';

describe('Executable param', () => {
  const context: ControllerContextType = {
    controllerInstance: new class {}(),
    controllerAction: 'list'
  };

  function executeParamAndCheckResult (context: ControllerContextType, param: ResolvedParamType, expectedResult: unknown) {
    const executableParam = new ExecutableParam(context, param);
    expect(executableParam.execute({} as RouterContext)).toStrictEqual(expectedResult);
  }

  it('Returns function result', () => {
    executeParamAndCheckResult(context, () => true, true);
  });

  it('Returns arguments arays', () => {
    executeParamAndCheckResult(context, ['1', '2'], ['1', '2']);
  });

  it('Returns controller context', () => {
    executeParamAndCheckResult(context, context, context);
  });

  test('Controller context is passed in handle function', () => {
    const paramFunction = jest.fn((ctx: ControllerParamsContext<unknown>) => ctx);
    const executableParam = new ExecutableParam(context, paramFunction);
    const expectedContext = {
      ...context,
      ctx: {}
    };
    executableParam.execute({} as RouterContext);
    expect(paramFunction).toBeCalledTimes(1);
    expect(paramFunction).toBeCalledWith(expectedContext);
  });
});
