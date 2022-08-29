import { JsonapiError } from './error.js';

export class NotFoundError extends JsonapiError {
  public status = '404';
  public code = this.constructor.name;
}
