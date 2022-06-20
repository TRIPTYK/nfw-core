import { JsonApiError } from './json-api-error.js';

export class BadContentTypeError extends JsonApiError {
  constructor (message: string) {
    super(415, message);
  }
}
