import { JsonapiError } from '../error.js';

export class RelationshipNotFoundError extends JsonapiError {
  status = '404';
  code = this.constructor.name;
}
