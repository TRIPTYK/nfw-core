import type { AbstractResource, AbstractResourceAuthorizer, AbstractResourceFactory, AbstractResourceValidator, ResourceSchema } from 'resources';
import type { Class } from 'type-fest';
import type { JsonApiResourceAdapter } from '../adapter.js';
import type { JsonApiResourceDeserializer } from '../deserializer.js';
import type { JsonApiResourceSerializer } from '../serializer.js';

export interface JsonApiResourceRegistry<T extends AbstractResource> {
    factory: AbstractResourceFactory<T>,
    deserializer: JsonApiResourceDeserializer<T>,
    serializer: JsonApiResourceSerializer<T>,
    resourceClass: Class<T>,
    schema: ResourceSchema<T>,
    adapter: JsonApiResourceAdapter<T>,
    validator: AbstractResourceValidator<T>,
    authorizer: AbstractResourceAuthorizer<unknown, T, string>,
  }
