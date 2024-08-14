/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { container, singleton } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import type { ResourceDeserializer } from '../interfaces/deserializer.js';
import type { Resource } from '../interfaces/resource.js';
import type { ResourceSchema } from '../interfaces/schema.js';
import type { ResourceSerializer } from '../interfaces/serializer.js';
import { JsonApiResourceSerializer } from '../serialization/serializer.js';
import { JsonApiResourceDeserializer } from '../serialization/deserializer.js';

export interface BaseConfig {
  host: string,
}

export interface ResourcesRegistry {
    getSchemaFor<T extends Resource>(type: string): ResourceSchema<T>,
    getConfig(): BaseConfig,
    getSerializerFor(type: string): ResourceSerializer,
    getDeserializerFor<T extends Record<string, unknown>>(type: string): ResourceDeserializer<T>,
}

@singleton()
export class ResourcesRegistryImpl implements ResourcesRegistry {
  getSchemaFor<T extends Resource> (type: string): ResourceSchema<T> {
    return container.resolve(`schema:${type}`) as ResourceSchema<T>;
  }

  getConfig (): BaseConfig {
    return container.resolve('global:config');
  }

  getSerializerFor (type: string): ResourceSerializer {
    return container.resolve(`serializer:${type}`);
  }

  getDeserializerFor<T extends Record<string, unknown>> (type: string): ResourceDeserializer<T> {
    return container.resolve(`deserializer:${type}`);
  }

  // eslint-disable-next-line max-statements
  register<T extends Resource> (type: string, classes: {
    serializer?: Class<ResourceSerializer>,
    deserializer?: Class<ResourceDeserializer<T>>,
    schema: ResourceSchema<T>,
  }): void {
    const registry = this;

    if (!classes.serializer) {
      classes.serializer = class DefaultSerializer extends JsonApiResourceSerializer {
        public constructor () {
          super(registry);
        }
      };
    }

    if (!classes.deserializer) {
      classes.deserializer = class DefaultDeserializer extends JsonApiResourceDeserializer<T> {
        public constructor () {
          super(classes.schema.resourceType, registry);
        }
      };
    }

    container.register(`serializer:${type}`, { useClass: classes.serializer });
    container.register(`deserializer:${type}`, { useClass: classes.deserializer });
    container.register(`schema:${type}`, {
      useValue: classes.schema,
    });
  }

  setConfig (config: BaseConfig): void {
    container.register('global:config', {
      useValue: config,
    });
  }
}
