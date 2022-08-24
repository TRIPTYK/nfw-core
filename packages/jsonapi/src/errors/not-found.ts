import { JsonapiError } from './error.js';

export class NotFoundError extends JsonapiError {
  status = '404';
  code = this.constructor.name;
}
