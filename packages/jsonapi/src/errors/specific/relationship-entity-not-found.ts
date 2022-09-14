import { NotFoundError } from '../not-found.js';

export class RelationshipEntityNotFoundError extends NotFoundError {
  code = this.constructor.name;
}
