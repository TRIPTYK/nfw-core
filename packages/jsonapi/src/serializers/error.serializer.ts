
import type { RouterContext } from '@koa/router';
import { JsonapiError } from '../errors/error.js';
import type { JsonApiErrorObject } from './spec.interface.js';

export class ErrorHandler {
  public async handle (err: Error | JsonapiError | JsonapiError[], ctx: RouterContext) {
    const out : JsonApiErrorObject[] = [];
    if (Array.isArray(err)) {
      out.push(...err.map((e) => this.serializeError(e)));
    } else {
      out.push(this.serializeError(err));
    }

    ctx.status = this.getGeneralErrorCode(out);

    ctx.body = {
      errors: out
    };
    ctx.type = 'application/vnd.api+json';
  }

  protected serializeError (error: JsonapiError | Error): JsonApiErrorObject {
    if (error instanceof JsonapiError) {
      return {
        status: error.status,
        detail: error.detail,
        code: error.code,
        source: error.source,
        links: error.links,
        meta: error.meta
      };
    }

    return {
      detail: error.message,
      code: error.name,
      status: '500'
    }
  }

  private getGeneralErrorCode (errors: JsonApiErrorObject[]) {
    if (errors.length === 1) {
      return errors[0].status ? parseInt(errors[0].status) : 500;
    }
    const maxStatus = Math.max(
      ...errors.map((c) => +(c.status ?? 400))
    );
    return Math.floor(maxStatus / 100) * 100;
  }
}
