import type { Promisable } from 'type-fest';
import type { JsonApiQuery } from './query/query.js';
import type { Resource, ResourceAdapter } from 'resources';

export interface JsonApiResourceAdapter<T extends Resource> extends ResourceAdapter {
    create(resource: T, query: JsonApiQuery): Promisable<void>,
    findAll(query: JsonApiQuery): Promisable<[T[], number]>,
    findById(id: string, query: JsonApiQuery): Promisable<T>,
    update(resource: T, query: JsonApiQuery): Promisable<void>,
    delete(resource: T, query: JsonApiQuery): Promisable<void>,
}
