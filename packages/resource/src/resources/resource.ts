interface ResourceAdditionalProperties {
    delete(): void,
}

export type Resource<T extends object> = T & ResourceAdditionalProperties;
