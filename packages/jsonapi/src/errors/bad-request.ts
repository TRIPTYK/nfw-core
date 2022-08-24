import { JsonapiError } from './error.js';

export class BadRequestError extends JsonapiError {
  status = '400';
  code = this.constructor.name;
}
