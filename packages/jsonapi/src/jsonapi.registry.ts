import type { AnyEntity, EntityClass } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import { inject, singleton } from '@triptyk/nfw-core';
import { databaseInjectionToken } from '@triptyk/nfw-mikro-orm';
import type { JsonApiModelInterface } from './interfaces/model.interface.js';
import type { Resource } from './resource/base.resource.js';
import { JsonApiSerializer } from './serializers/base.serializer.js';
import { MetadataStorage } from './storage/metadata-storage.js';

export interface AttributeMeta {
    name: string,
    fetchable: Function | boolean,
    updateable: Function | boolean,
    createable: Function | boolean,
}

export interface RelationMeta {
    resource: ResourceMeta,
    name :string,
}

export interface ResourceMeta {
    resource: Class<Resource<unknown>>,
    name: string,
    mikroEntity: AnyEntity,
    allowedAttributes: AttributeMeta[],
    allowedRelationships: RelationMeta[],
    serializer: JsonApiSerializer<JsonApiModelInterface>,
}

@singleton()
export class JsonApiRegistry {
  public resources = new Map<Class<Resource<unknown>>, ResourceMeta>([]);

  constructor (@inject(databaseInjectionToken) private orm: MikroORM) {}

  public getResourceByName (name: string) {
    for (const key of this.resources.keys()) {
      if (key.name === name) {
        return this.resources.get(key);
      }
    }
    return undefined;
  }

  public init () {
    for (const resource of MetadataStorage.instance.resources) {
      this.resources.set(resource.target, {} as any);
    }

    for (const resource of MetadataStorage.instance.resources) {
      const entityName = (resource.options.entity as EntityClass<any>).name;
      const mikroEntity = this.orm.getMetadata().find(entityName);

      if (!mikroEntity) {
        throw new Error(`Entity data ${entityName} not found, is it registered in mikro-orm ?`);
      }

      const repository = this.orm.em.getRepository(mikroEntity.class);

      const resourceTargetPrototype = (resource.target as Class<unknown>).prototype;

      const allowedAttributes: AttributeMeta[] = MetadataStorage.instance.getAllowedAttributesFor(resourceTargetPrototype).map((e) => ({
        name: e.propertyName,
        fetchable: true,
        updateable: false,
        createable: false
      }));
      const allowedRelations : RelationMeta[] = MetadataStorage.instance.getAllowedRelationshipsFor(resourceTargetPrototype)
        .map((e) => {
          const resource = this.getResourceByName(e.options.otherResource);
          if (!resource) throw new Error('Cannot find resource ' + e.options.otherResource);
          return {
            resource,
            name: e.propertyName
          }
        })

      const serializer = new JsonApiSerializer();

      const resourceRef = this.resources.get(resource.target)!;
      resourceRef.mikroEntity = mikroEntity;
      resourceRef.name = resource.options.entityName;
      resourceRef.allowedAttributes = allowedAttributes;
      resourceRef.allowedRelationships = allowedRelations;
      resourceRef.serializer = serializer;
      resourceRef.resource = resource.target

      Object.defineProperty(repository, 'meta', {
        value: resourceRef,
        writable: false
      });
      serializer.resource = resourceRef;

      Object.freeze(resourceRef);
    }
  }
}
