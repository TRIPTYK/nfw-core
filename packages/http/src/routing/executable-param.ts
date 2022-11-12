import type { RouterContext } from '@koa/router';
import type { ControllerContext } from '../types/controller-context.js';
import type { ResolvedParam } from './guard-resolver.js';

export class ExecutableParam {
  public constructor (
    public controllerContext: ControllerContext,
    private param: ResolvedParam
  ) {}

  public execute (ctx: RouterContext) {
    if (this.param instanceof Function) {
      return this.param({
        ctx,
        ...this.controllerContext
      });
    }
    return this.param;
  }
}
