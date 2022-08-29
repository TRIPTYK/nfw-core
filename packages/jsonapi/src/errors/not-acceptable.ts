import { JsonapiError } from './error.js';

export class NotAcceptableError extends JsonapiError {
  public status = '406';
  public code = this.constructor.name;
}
