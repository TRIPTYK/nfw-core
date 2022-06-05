import type { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '../../../../src/index.js';
import { Args, Ctx, Ip, Method } from '../../../../src/index.js';

export class MetaResponseHandler implements ResponseHandlerInterface {
  handle (controllerResponse: unknown, @Ctx() ctx: RouterContext, @Method() method:string, @Ip() ip: string, @Args() [description]:[string]): void | Promise<void> {
    ctx.response.body = {
      data: controllerResponse,
      meta: {
        method,
        ip,
        description,
        state: ctx.state
      }
    }
  }
}
