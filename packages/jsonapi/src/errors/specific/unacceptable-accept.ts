import { JsonapiError } from '../error.js';

export class UnsupportedMediaTypeError extends JsonapiError {
  status = '415';
  code = this.constructor.name;
}
