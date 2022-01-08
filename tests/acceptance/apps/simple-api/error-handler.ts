import { RouterContext } from '@koa/router'
import { HttpError } from 'http-errors';
import { DefaultContext, DefaultState } from 'koa';
import { ErrorHandlerInterface } from '../../../../src/index.js';

export class ErrorHandler implements ErrorHandlerInterface {
  handle (error: HttpError, context: RouterContext<DefaultState, DefaultContext>): void | Promise<void> {
    context.body = {
      message: error.message
    }
  }
}
