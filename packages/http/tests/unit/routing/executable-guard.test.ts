/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import type { GuardInterface } from '../../../src/interfaces/guard.js';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { ForbiddenError } from '../../../src/errors/forbidden.js';
import type { RouterContext } from '@koa/router';
import { ExecutableGuard, ExecutableParam } from '../../../src/index.js';

describe('Executable Guard', () => {
  let guardInstance : GuardInterface;
  let returnValue: boolean;

  const context = {
    controllerInstance: new class {}(),
    controllerAction: 'list'
  };

  beforeEach(() => {
    guardInstance = new class implements GuardInterface {
      // eslint-disable-next-line class-methods-use-this
      public async can () {
        return returnValue;
      }
    }();
  });

  it('Guard throw error when returning other than true', async () => {
    returnValue = false;
    const executableGuard = new ExecutableGuard(guardInstance, context, []);
    expect(() => executableGuard.execute({} as RouterContext)).rejects.toThrowError(ForbiddenError);
  });
  it('Guard does not throw error when returning true', async () => {
    returnValue = true;
    const executableGuard = new ExecutableGuard(guardInstance, context, []);
    expect(() => executableGuard.execute({} as RouterContext)).not.toThrowError();
  });
  it('Resolves params correctly', async () => {
    returnValue = true;
    const spy = jest.spyOn(guardInstance, 'can');
    const firstParam = new ExecutableParam(context, ['blah']);
    const secondParam = new ExecutableParam(context, () => 'hello');
    const executableGuard = new ExecutableGuard(guardInstance, context, [firstParam, secondParam]);
    await executableGuard.execute({} as RouterContext);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(['blah'], 'hello');
  });
});
