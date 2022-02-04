import { RouterContext } from '@koa/router';
import { Args, Ctx, Ip, Method, ResponseHandlerInterface } from '../../../../src/index.js';

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