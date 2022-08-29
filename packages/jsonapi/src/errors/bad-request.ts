import { JsonapiError } from './error.js';

export class BadRequestError extends JsonapiError {
  public status = '400';
  public code = this.constructor.name;
}
