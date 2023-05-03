import type { RouterContext } from '@koa/router';
import isClass from 'is-class';
import type { ExecutableInterface } from '../interfaces/executable.js';
import { ParamInterface } from '../interfaces/param.js';
import { ControllerParamsContext } from '../storages/metadata/use-param.js';
import type { ControllerContextType } from '../types/controller-context.js';
import type { ResolvedParamType } from '../types/resolved-param.js';

export class ExecutableParam implements ExecutableInterface {
  public constructor (
    public controllerContext: ControllerContextType,
    private param: ResolvedParamType
  ) {}

  public execute (ctx: RouterContext) {
    if (typeof (this.param as ParamInterface<unknown>)['handle'] === 'function')  {
      return  (this.param as ParamInterface<unknown>).handle(this.makeContext(ctx)); 
    }
    if (typeof this.param === 'function') {
      return this.param(this.makeContext(ctx));
    }
    return this.param;
  }

  private makeContext(ctx: RouterContext): ControllerParamsContext<unknown> {
    return {
      ctx,
      ...this.controllerContext
    };
  }
}
