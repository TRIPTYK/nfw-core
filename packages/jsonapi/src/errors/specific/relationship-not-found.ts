import { NotFoundError } from '../not-found.js';

export class RelationshipNotFoundError extends NotFoundError {
  public code = this.constructor.name;
}
