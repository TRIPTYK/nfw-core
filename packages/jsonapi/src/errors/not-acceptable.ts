import { JsonapiError } from './error.js';

export class NotAcceptableError extends JsonapiError {
  status = '406';
  code = this.constructor.name;
}
