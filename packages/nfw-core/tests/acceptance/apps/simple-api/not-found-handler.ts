import type { RouterContext } from '@koa/router'
import type { DefaultContext, DefaultState } from 'koa';
import type { MiddlewareInterface } from '../../../../src/index.js';

export class NotFoundMiddleware implements MiddlewareInterface {
  use (context: RouterContext<DefaultState, DefaultContext>): void | Promise<void> {
    context.body = {
      message: 'Subroute not found'
    }
  }
}
