import { JsonapiError } from './error.js';

export class ForbiddenError extends JsonapiError {
  status = '403';
  code = this.constructor.name;
}
