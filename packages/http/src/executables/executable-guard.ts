import type { RouterContext } from '@koa/router';
import { ForbiddenError } from '../errors/forbidden.js';
import type { GuardInterface } from '../interfaces/guard.js';
import type { ControllerContextType } from '../types/controller-context.js';
import { executeParams } from '../utils/execute-params.js';
import type { ExecutableParam } from './executable-param.js';

export class ExecutableGuard {
  public constructor (
    public instance: GuardInterface,
    public controllerContext: ControllerContextType,
    public params: ExecutableParam[]
  ) {}

  public async execute (ctx: RouterContext) {
    const params = await executeParams(this.params, ctx);
    const guardRes = await this.instance.can(...params);
    if (guardRes !== true) {
      throw new ForbiddenError();
    }
  }
}
