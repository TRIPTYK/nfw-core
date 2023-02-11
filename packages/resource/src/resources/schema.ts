import type { StringKeyOf } from 'type-fest';
import type { ResourceAuthorizer } from './authorizer.js';
import type { ResourceValidator } from './validator.js';

export interface ResourceProperty {
    type: string,
}

export type ResourceStructure<T extends object> = {
    [key in StringKeyOf<T>]: ResourceProperty
}

export interface ResourceSchema<T extends object> {
    validator: ResourceValidator,
    structure: ResourceStructure<T>,
    authorization: {
      authorizer: ResourceAuthorizer<T>,
    },
}
