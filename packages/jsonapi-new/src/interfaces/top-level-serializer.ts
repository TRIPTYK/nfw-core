import type { ResourceInterface } from './resource.js';

export interface TopLevelSerializerInterface {
    serialize(resource: ResourceInterface | ResourceInterface[] | null): unknown,
}
