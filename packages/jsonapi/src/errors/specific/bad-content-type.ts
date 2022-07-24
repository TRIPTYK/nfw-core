import { JsonapiError } from '../error.js';

export class BadContentTypeError extends JsonapiError {
  status = '400';
  code = this.constructor.name;
}
