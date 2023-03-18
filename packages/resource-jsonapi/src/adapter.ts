import type { AbstractResource } from 'resources';
import { AbstractResourceAdapter } from 'resources';
import type { Promisable } from 'type-fest';
import type { JsonApiQuery } from './query/query.js';

export abstract class JsonApiResourceAdapter<T extends AbstractResource> extends AbstractResourceAdapter<T> {
    abstract create(resource: T, query: JsonApiQuery): Promisable<void>;
    abstract findAll(query: JsonApiQuery): Promisable<[T[], number]>;
    abstract findById(id: string, query: JsonApiQuery): Promisable<T>;
    abstract update(resource: T, query: JsonApiQuery): Promisable<void>;
    abstract delete(resource: T, query: JsonApiQuery): Promisable<void>;
}
