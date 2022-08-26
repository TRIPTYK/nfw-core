import { NotFoundError } from '../not-found.js';

export class RelationshipNotFoundError extends NotFoundError {
  code = this.constructor.name;
}
