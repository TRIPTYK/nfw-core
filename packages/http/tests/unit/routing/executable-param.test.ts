/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import type { ControllerContextType } from '../../../src/types/controller-context.js';
import type { ControllerParamsContext } from '../../../src/index.js';
import { ExecutableParam } from '../../../src/index.js';
import type { ResolvedParamType } from '../../../src/types/resolved-param.js';
import { describe, expect, it, vi, test } from 'vitest';
import type { ParamInterface } from '../../../src/interfaces/param.js';

describe('Executable param', () => {
  const context: ControllerContextType = {
    controllerInstance: new class {}(),
    controllerAction: 'list',
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

  it('Calls decorator handle when class instance is passed', () => {
    class ParamHandler implements ParamInterface<unknown> {
      handle = vi.fn();
    }
    const instance = new ParamHandler();
    const executableParam = new ExecutableParam(context, instance);
    executableParam.execute({} as never);
    expect(instance.handle).toBeCalledTimes(1);
  });

  test('Controller context is passed in handle function', () => {
    const paramFunction = vi.fn((ctx: ControllerParamsContext<unknown>) => ctx);
    const executableParam = new ExecutableParam(context, paramFunction);
    const expectedContext = {
      ...context,
      ctx: {},
    };
    executableParam.execute({} as RouterContext);
    expect(paramFunction).toBeCalledTimes(1);
    expect(paramFunction).toBeCalledWith(expectedContext);
  });
});
