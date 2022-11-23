import type { RouterContext } from '@koa/router';
import type { ControllerContext } from '../types/controller-context.js';
import { executeParams } from '../utils/execute-params.js';
import type { ExecutableParam } from './executable-param.js';

export class ExecutableControllerAction {
  public constructor (
    public controllerContext: ControllerContext,
    public params: ExecutableParam[]
  ) {}

  public async execute (ctx: RouterContext) {
    const controllerMethod = (this.controllerContext.controllerInstance as any)[this.controllerContext.controllerAction] as Function;
    const params = await executeParams(this.params, ctx);

    return controllerMethod.call(this.controllerContext.controllerInstance, ...params);
  }
}
