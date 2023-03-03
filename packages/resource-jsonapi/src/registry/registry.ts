/* eslint-disable class-methods-use-this */
import type { AbstractResource, ResourcesRegistry } from 'resources';
import { AbstractResourcesRegistry } from 'resources';
import { container, singleton } from '@triptyk/nfw-core';
import type { StringKeyOf, Class } from 'type-fest';
import type { JsonApiResourceRegistry } from './resource-registry.js';
import type { JsonApiRegistration } from './registration.js';

export interface JsonApiResourcesRegistry extends ResourcesRegistry {
  register<T extends AbstractResource>(type: string, registry: JsonApiRegistration<T>): void,
  isRegistered(type: string): boolean,
  get<T extends AbstractResource>(type: string): JsonApiResourceRegistry<T>,
}

@singleton()
export class JsonApiRegistryImpl extends AbstractResourcesRegistry {
  protected resolveInstance<T extends AbstractResource, K extends StringKeyOf<JsonApiResourceRegistry<T>>> (instanceToken: Class<JsonApiResourceRegistry<T>[K]>): JsonApiResourceRegistry<T>[K] {
    return container.resolve(instanceToken);
  }
}
