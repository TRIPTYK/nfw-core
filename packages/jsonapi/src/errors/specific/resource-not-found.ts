import { JsonapiError } from '../error.js';

export class ResourceNotFoundError extends JsonapiError {
  status = '404';
  code = this.constructor.name;
}
