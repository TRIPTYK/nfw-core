export type FlattenResourceRelationships<T extends object> = {
    [key in keyof T]: T[key] extends Record<string, unknown>[]
    ? string[]
    : T[key] extends Record<string, unknown>
    ? string
    : T[key]
};