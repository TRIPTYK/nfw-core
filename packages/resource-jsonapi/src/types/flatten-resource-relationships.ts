import { Resource } from "../resource/resource.js";

export type FlattenResourceRelationships<T extends object> = {
    [key in keyof T]: T[key] extends Resource[]
    ? string[]
    : T[key] extends Resource
    ? string
    : T[key]
};