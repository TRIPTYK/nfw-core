import type { RelationshipInterface } from './relationship.js';

export interface ResourceInterface {
    getName(): string,
    getId(): string,
    attributes(): Record<string, unknown>,
    relationships(): RelationshipInterface[],
}
