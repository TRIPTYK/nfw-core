/* eslint-disable class-methods-use-this */
import type { Resource, ResourceRegistry } from 'resources';
import { AbstractResourceRegistry } from 'resources';
import { container, singleton } from '@triptyk/nfw-core';
import type { StringKeyOf, Class } from 'type-fest';

@singleton()
export class ResourcesRegistryImpl extends AbstractResourceRegistry {
  protected resolveInstance<T extends Resource, K extends StringKeyOf<ResourceRegistry<T>>> (instanceToken: Class<ResourceRegistry<T>[K]>): ResourceRegistry<T>[K] {
    return container.resolve(instanceToken);
  }
}
