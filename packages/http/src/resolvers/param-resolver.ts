import type { ControllerContextType } from '../types/controller-context.js';
import type { ParamsHandleFunction, UseParamsMetadataArgs } from '../storages/metadata/use-param.js';

import type { ResolverInterface } from '../interfaces/resolver.js';
import { UnknownSpecialContextError } from '../errors/unknown-special-context.js';
import { ExecutableParam } from '../executables/executable-param.js';

export class ParamResolver implements ResolverInterface {
  public constructor (
      public handle: UseParamsMetadataArgs['handle'],
      public controllerContext: ControllerContextType
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
    throw new UnknownSpecialContextError(`${this.handle} is an unknown special context`);
  }
}