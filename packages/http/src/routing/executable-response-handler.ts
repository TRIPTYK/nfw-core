import type { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import type { ControllerContext } from '../types/controller-context.js';
import { executeParams } from '../utils/execute-params.js';
import type { ExecutableParam } from './executable-param.js';

export class ExecutableResponseHandler {
  public constructor (
        public instance: ResponseHandlerInterface,
        public controllerContext: ControllerContext,
        public params: ExecutableParam[]
  ) {}

  public async execute (previousResponse: unknown, ctx: RouterContext) {
    const params = await executeParams(this.params, ctx);
    await this.instance.handle(previousResponse, ...params);
  }
}
