import { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '@triptyk/nfw-http';
import { Ctx, Args } from '@triptyk/nfw-http';

export class RestResponseHandler implements ResponseHandlerInterface {
  public handle (lastResult: unknown, @Args() options: {
    attachMeta?: boolean,
  } | undefined, @Ctx() ctx: RouterContext): void | Promise<void> {
    ctx.body = {
      meta: options?.attachMeta ? 'meta' : undefined,
      data: lastResult
    };
  }
}
