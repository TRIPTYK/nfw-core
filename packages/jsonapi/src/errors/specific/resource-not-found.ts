import { NotFoundError } from '../not-found.js';

export class ResourceNotFoundError extends NotFoundError {
  public code = this.constructor.name;
}
