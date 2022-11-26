import type { RouterContext } from '@koa/router';
import type { ExecutableInterface } from '../interfaces/executable.js';
import type { ControllerContextType } from '../types/controller-context.js';
import type { ResolvedParamType } from '../types/resolved-param.js';

export class ExecutableParam implements ExecutableInterface {
  public constructor (
    public controllerContext: ControllerContextType,
    private param: ResolvedParamType
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
