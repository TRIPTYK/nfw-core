import type { RouterContext } from '@koa/router';
import type { ControllerContext } from '../types/controller-context.js';
import type { ResolvedParam } from './guard-resolver.js';

export class ExecutableParam {
  public constructor (
    public controllerContext: ControllerContext,
    private param: ResolvedParam
  ) {}

  public execute (ctx: RouterContext) {
    if (typeof this.param === 'function') {
      return this.param({
        ctx,
        ...this.controllerContext
      });
    }
    return this.param;
  }
}
