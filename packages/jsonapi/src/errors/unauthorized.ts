import { JsonapiError } from './error.js';

export class UnauthorizedError extends JsonapiError {
  status = '401';
  code = this.constructor.name;
}
