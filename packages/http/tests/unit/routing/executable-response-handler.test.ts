/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import type { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '../../../src/interfaces/response-handler.js';
import { ExecutableParam } from '../../../src/executables/executable-param.js';
import { ExecutableResponseHandler } from '../../../src/executables/executable-response-handler.js';
import { describe, expect, it, vi } from 'vitest';

describe('Executable response handler', () => {
  class RH implements ResponseHandlerInterface {
    // eslint-disable-next-line class-methods-use-this
    public handle (): void | Promise<void> {}
  }

  it('Resolves params except the first', async () => {
    const responseHandlerInstance = new RH();
    const routerContext = {} as RouterContext;
    const controllerContext = {
      controllerAction: 'list',
      controllerInstance: new class {}(),
    };
    const spy = vi.spyOn(responseHandlerInstance, 'handle');
    const firstParam = new ExecutableParam(controllerContext, () => 'param2');

    const executableResponseHandler = new ExecutableResponseHandler(
      responseHandlerInstance,
      controllerContext,
      [firstParam],
    );

    await executableResponseHandler.execute('hello', routerContext);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('hello', 'param2');
  });
});
