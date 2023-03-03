import type { AbstractResource } from 'resources';
import { AbstractResourceAdapter } from 'resources';

export abstract class JsonApiResourceAdapter<T extends AbstractResource> extends AbstractResourceAdapter<T> {
    abstract create(resource: T): void;
}
