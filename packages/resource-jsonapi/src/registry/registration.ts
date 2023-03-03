import type { AbstractResource, AbstractResourceAuthorizer, AbstractResourceFactory, AbstractResourceValidator, RegistryRegistration, ResourceSchema } from 'resources';
import type { Class } from 'type-fest';
import type { JsonApiResourceAdapter } from '../adapter.js';
import type { JsonApiResourceDeserializer } from '../deserializer.js';
import type { JsonApiResourceSerializer } from '../serializer.js';

export interface JsonApiRegistration<T extends AbstractResource> extends RegistryRegistration<T> {
    factory: Class<AbstractResourceFactory<T>>,
    deserializer: Class<JsonApiResourceDeserializer<T>>,
    serializer: Class<JsonApiResourceSerializer<T>>,
    resourceClass: Class<T>,
    schema: Class<ResourceSchema<T>>,
    adapter: Class<JsonApiResourceAdapter<T>>,
    validator: Class<AbstractResourceValidator<T>>,
    authorizer: Class<AbstractResourceAuthorizer<unknown, T, string, unknown>>,
}
