import type { RouterContext } from '@koa/router';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import { isSpecialHandle, resolveSpecialContext } from './controller-action.js';

export class ParamResolver {
  public constructor (
      public paramMeta: UseParamsMetadataArgs
  ) {}

  public handleParam (contextArgs: unknown[], controllerAction: string, controllerInstance: unknown, ctx: RouterContext) {
    if (isSpecialHandle(this.paramMeta.handle)) {
      return resolveSpecialContext(this.paramMeta, contextArgs, controllerAction, controllerInstance);
    }
    return (this.paramMeta.handle as ParamsHandleFunction)({
      controllerInstance,
      controllerAction,
      ctx,
      args: contextArgs
    });
  }
}
