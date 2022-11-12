import type { RouterContext } from '@koa/router';
import { ForbiddenError } from '../errors/forbidden.js';
import type { GuardInterface } from '../interfaces/guard.js';
import type { ControllerContext } from '../types/controller-context.js';
import type { ExecutableParam } from './executable-param.js';

export class ExecutableGuard {
  public constructor (
    public instance: GuardInterface,
    public controllerContext: ControllerContext,
    public params: ExecutableParam[]
  ) {}

  public async execute (ctx: RouterContext) {
    const params = await this.executeParams(ctx);
    const guardRes = await this.instance.can(...params);
    if (guardRes !== true) {
      throw new ForbiddenError();
    }
  }

  private async executeParams (ctx: RouterContext) {
    return Promise.all(this.params.map((p) => p.execute(ctx)));
  }
}
