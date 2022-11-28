import type { RelationshipInterface } from './relationship.js';

export interface RelationshipSerializerInterface {
    serialize(relationship: RelationshipInterface): unknown,
}
