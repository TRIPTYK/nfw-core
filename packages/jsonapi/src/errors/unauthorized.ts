import { JsonapiError } from './error.js';

export class UnauthorizedError extends JsonapiError {
  public status = '401';
  public code = this.constructor.name;
}
