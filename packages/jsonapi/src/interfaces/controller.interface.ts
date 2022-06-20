import type { JsonApiRepository } from '../repository/jsonapi.repository.js';

export interface JsonApiController<T> {
    repository: JsonApiRepository<T>,
}
