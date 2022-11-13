/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import type { RouterContext } from '@koa/router';
import { jest } from '@jest/globals';
import type { ResponseHandlerInterface } from '../../../src/index.js';
import { ExecutableParam } from '../../../src/routing/executable-param.js';
import { ExecutableResponseHandler } from '../../../src/routing/executable-response-handler.js';

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
      controllerInstance: new class {}()
    };
    const spy = jest.spyOn(responseHandlerInstance, 'handle');
    const firstParam = new ExecutableParam(controllerContext, () => 'param2');

    const executableResponseHandler = new ExecutableResponseHandler(
      responseHandlerInstance,
      controllerContext,
      [firstParam]
    );

    await executableResponseHandler.execute('hello', routerContext);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('hello', 'param2');
  });
});
