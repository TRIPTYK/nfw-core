import { NotFoundError } from '../not-found.js';

export class ResourceNotFoundError extends NotFoundError {
  code = this.constructor.name;
}
