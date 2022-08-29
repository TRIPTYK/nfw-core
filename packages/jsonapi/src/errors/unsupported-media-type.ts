import { JsonapiError } from './error.js';

export class UnsupportedMediaTypeError extends JsonapiError {
  public status = '415';
  public code = this.constructor.name;
}
