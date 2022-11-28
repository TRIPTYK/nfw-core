import type { Class } from 'type-fest';
import type { ResourceSerializerInterface } from './resource-serializer.js';

export interface RegistryInterface {
    registerSerializerFor(resourceName: string, serializer: Class<ResourceSerializerInterface>): void,
    serializerFor(resourceName: string): ResourceSerializerInterface | undefined,
}
