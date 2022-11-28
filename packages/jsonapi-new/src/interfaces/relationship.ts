import type { ResourceInterface } from './resource.js';

export interface RelationshipInterface {
    name: string,
    value: ResourceInterface | ResourceInterface[] | null | undefined,
}
