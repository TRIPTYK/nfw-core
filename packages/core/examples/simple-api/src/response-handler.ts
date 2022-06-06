import type { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '@triptyk/nfw-core';
import { Args, Ctx, Ip, Method } from '@triptyk/nfw-core';

export class MetaResponseHandler implements ResponseHandlerInterface {
  handle (controllerResponse: unknown, @Ctx() ctx: RouterContext, @Method() method:string, @Ip() ip: string, @Args() [description]:[string]): void | Promise<void> {
    ctx.response.body = {
      data: controllerResponse,
      meta: {
        method,
        ip,
        description
      }
    }
  }
}
