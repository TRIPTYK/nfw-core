import type { Promisable } from 'type-fest';

export interface ResourceDeserializer<T extends Record<string, unknown>> {
    deserialize(payload: T): Promisable<T>,
}
