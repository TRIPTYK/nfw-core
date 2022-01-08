import { RouterContext } from '@koa/router'
import { DefaultContext, DefaultState } from 'koa';
import { MiddlewareInterface } from '../../../../src/index.js';

export class NotFoundMiddleware implements MiddlewareInterface {
  use (context: RouterContext<DefaultState, DefaultContext>): void | Promise<void> {
    context.body = {
      message: 'Subroute not found'
    }
  }
}
