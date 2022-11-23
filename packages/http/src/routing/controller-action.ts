import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import type { ControllerActionResolver } from './controller-action-resolver.js';
import type { ExecutableControllerAction } from './executable-controller-action.js';
import type { ExecutableGuard } from './executable-guard.js';
import type { ExecutableResponseHandler } from './executable-response-handler.js';
import type { GuardResolver } from './guard-resolver.js';
import type { ResponseHandlerResolver } from './response-handler-resolver.js';

async function executeGuards (guardsInstance: ExecutableGuard[], ctx: RouterContext) {
  for (const guard of guardsInstance) {
    await guard.execute(ctx);
  }
}

export class ControllerActionBuilder {
  public constructor (
    public guardResolver: GuardResolver,
    public responseHandlerResolver: ResponseHandlerResolver,
    public controllerActionResolver: ControllerActionResolver
  ) {}

  public build () {
    return this.controllerActionMiddleware(
      this.controllerActionResolver.resolve(),
      this.guardResolver.resolve(),
      this.responseHandlerResolver.resolve()
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private controllerActionMiddleware (
    executableControllerAction: ExecutableControllerAction,
    executableGuards: ExecutableGuard[],
    executableResponseHandler: ExecutableResponseHandler | undefined
  ) {
    return async (ctx: RouterContext, _next: Next) => {
      await executeGuards(executableGuards, ctx);

      const controllerActionResult = await executableControllerAction.execute(ctx);

      if (executableResponseHandler) {
        return executableResponseHandler.execute(controllerActionResult, ctx);
      }

      ctx.response.body = controllerActionResult;
    };
  }
}
