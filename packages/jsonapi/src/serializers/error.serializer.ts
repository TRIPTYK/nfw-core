
import { JsonapiErrorCollection } from '../errors/error-collection.js';
import type { JsonapiError } from '../errors/error.js';
import type { JsonApiErrorObject } from './spec.interface.js';

export class ErrorSerializer {
  public serialize (err: Error | JsonapiError | JsonapiErrorCollection) {
    const out : JsonApiErrorObject[] = [];
    if (err instanceof JsonapiErrorCollection) {
      out.push(...err.errors.map((e) => this.serializeError(e)));
    } else {
      out.push(this.serializeError(err));
    }

    return {
      errors: out
    }
  }

  protected serializeError (error: JsonapiError | Error): JsonApiErrorObject {
    if (error instanceof Error) {
      return {
        status: '500',
        detail: error.message,
        code: error.name
      };
    }

    return {
      detail: error.detail,
      code: error.code
    }
  }
}
