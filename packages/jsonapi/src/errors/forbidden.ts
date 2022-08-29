import { JsonapiError } from './error.js';

export class ForbiddenError extends JsonapiError {
  public status = '403';
  public code = this.constructor.name;
}
