import { Promisable } from "type-fest";

export interface ResourceSerializer<T extends Record<string, unknown>> {
    serializeOne(resource: T): Promisable<unknown>;
    serializeMany(resource: T[]): Promisable<unknown>;
}