import type { Resource } from 'resources';
import { ResourceAdapter } from 'resources/build/src/adapter.js';

export abstract class JsonApiResourceAdapter<T extends Resource> extends ResourceAdapter<T> {
    abstract create(resource: T): void;
}
