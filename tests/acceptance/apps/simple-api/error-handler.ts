import type { RouterContext } from '@koa/router'
import type { HttpError } from 'http-errors';
import type { DefaultContext, DefaultState } from 'koa';
import type { ErrorHandlerInterface } from '../../../../src/index.js';

export class ErrorHandler implements ErrorHandlerInterface {
  handle (error: HttpError, context: RouterContext<DefaultState, DefaultContext>): void | Promise<void> {
    context.status = error.status;
    context.body = {
      message: error.message
    }
  }
}
