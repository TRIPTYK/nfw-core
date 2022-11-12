import type { ControllerContext } from '../types/controller-context.js';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import { ExecutableParam } from './executable-param.js';

export class ParamResolver {
  public constructor (
      public handle: UseParamsMetadataArgs['handle'],
      public controllerContext: ControllerContext
  ) {}

  public resolve (contextArgs: unknown[]) : ExecutableParam {
    if (this.isSpecialHandle()) {
      return new ExecutableParam(this.controllerContext, this.resolveSpecialContext(contextArgs));
    }
    return new ExecutableParam(this.controllerContext, this.handle as ParamsHandleFunction<any>);
  }

  private isSpecialHandle () {
    return this.handle === 'args' || this.handle === 'controller-context';
  }

  private resolveSpecialContext (args: unknown[]) {
    if (this.handle === 'args') {
      return args;
    }
    if (this.handle === 'controller-context') {
      return this.controllerContext;
    }
    throw new Error();
  }
}
