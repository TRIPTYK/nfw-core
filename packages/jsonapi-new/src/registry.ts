/* eslint-disable class-methods-use-this */
import type { RegistryInterface } from './interfaces/registry.js';
import type { ResourceSerializerInterface } from './interfaces/resource-serializer.js';
import { container } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';

export class NFWRegistry implements RegistryInterface {
  public registerSerializerFor (resourceName: string, serializer: Class<ResourceSerializerInterface>): void {
    container.registerInstance(this.serializerTokenName(resourceName), container.resolve(serializer));
  }

  public serializerFor (resourceName: string): ResourceSerializerInterface {
    return container.resolve(this.serializerTokenName(resourceName));
  }

  private serializerTokenName (resourceName: string) {
    return `serializer:${resourceName}`;
  }
}
