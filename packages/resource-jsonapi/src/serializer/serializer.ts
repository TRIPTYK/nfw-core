import { Promisable } from "type-fest";
import { Resource } from "../resource/resource.js";

export interface ResourceSerializer<T extends Resource> {
    serializeOne(resource: T): Promisable<unknown>;
    serializeMany(resource: T[]): Promisable<unknown>;
}