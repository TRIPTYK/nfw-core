import { NotFoundError } from '../not-found.js';

export class RelationshipEntityNotFoundError extends NotFoundError {
  public code = this.constructor.name;
}
