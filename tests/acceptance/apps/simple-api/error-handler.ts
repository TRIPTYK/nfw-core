import { RouterContext } from '@koa/router'
import { HttpError } from 'http-errors';
import { DefaultContext, DefaultState } from 'koa';
import { ErrorHandlerInterface } from '../../../../src/index.js';

export class ErrorHandler implements ErrorHandlerInterface {
  handle (error: HttpError, context: RouterContext<DefaultState, DefaultContext>): void | Promise<void> {
    context.status = error.status;
    context.body = {
      message: error.message
    }
  }
}
