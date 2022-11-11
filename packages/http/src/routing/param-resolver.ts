import type { RouterContext } from '@koa/router';
import type { ControllerContext } from '../types/controller-context.js';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';

export class ParamResolver {
  public constructor (
      public paramMeta: UseParamsMetadataArgs,
      public controllerAction: string,
      public controllerInstance: unknown
  ) {}

  public handleParam (contextArgs: unknown[], ctx: RouterContext) {
    if (this.isSpecialHandle()) {
      return this.resolveSpecialContext(contextArgs);
    }
    return (this.paramMeta.handle as ParamsHandleFunction<any>)({
      controllerInstance: this.controllerInstance,
      controllerAction: this.controllerAction,
      ctx,
      args: contextArgs
    });
  }

  private isSpecialHandle () {
    return this.paramMeta.handle === 'args' || this.paramMeta.handle === 'controller-context';
  }

  private resolveSpecialContext (args: unknown[]) {
    if (this.paramMeta.handle === 'args') {
      return args;
    }
    if (this.paramMeta.handle === 'controller-context') {
      return {
        controllerAction: this.controllerAction,
        controllerInstance: this.controllerInstance
      } as ControllerContext;
    }
  }
}
