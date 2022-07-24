import type { AnyEntity, EntityClass, EntityProperty } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import { inject, singleton } from '@triptyk/nfw-core';
import { databaseInjectionToken } from '@triptyk/nfw-mikro-orm';
import type { JsonApiModelInterface } from './interfaces/model.interface.js';
import type { Resource } from './resource/base.resource.js';
import { ResourceSerializer } from './serializers/resource.serializer.js';
import { MetadataStorage } from './storage/metadata-storage.js';

export interface AttributeMeta {
    name: string,
    mikroMeta: EntityProperty,
    resource: ResourceMeta,
}

export interface RelationMeta {
    resource: ResourceMeta,
    mikroMeta: EntityProperty,
    name :string,
}

export interface ResourceMeta {
    resource: Class<Resource<unknown>>,
    /**
     * The name of the entity for JSON:API
     * Will be pluralized for endpoints
    */
    name: string,
    mikroEntity: AnyEntity,
    attributes: AttributeMeta[],
    relationships: RelationMeta[],
    serializer: ResourceSerializer<JsonApiModelInterface>,
}

@singleton()
export class JsonApiRegistry {
  public resources = new Map<Class<Resource<unknown>>, ResourceMeta>([]);

  constructor (@inject(databaseInjectionToken) private orm: MikroORM) {}

  public getResourceByClassName (name: string) {
    for (const key of this.resources.keys()) {
      if (key.name === name) {
        return this.resources.get(key);
      }
    }
    return undefined;
  }

  public getResourceByName (name: string) {
    for (const v of this.resources.values()) {
      if (v.name === name) {
        return v;
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
      const resourceRef = this.resources.get(resource.target)!;

      if (!mikroEntity) {
        throw new Error(`Entity data ${entityName} not found, is it registered in mikro-orm ?`);
      }

      const repository = this.orm.em.getRepository(mikroEntity.class);

      const resourceTargetPrototype = (resource.target as Class<unknown>).prototype;

      const allowedAttributes: AttributeMeta[] = MetadataStorage.instance.getAllowedAttributesFor(resourceTargetPrototype).map((e) => {
        const mikroMeta = Object.values(mikroEntity.properties).find((p) => p.name === e.propertyName);
        if (!mikroMeta) throw new Error('Cannot find meta for property ' + e.propertyName);
        return {
          mikroMeta,
          name: e.propertyName,
          resource: resourceRef
        }
      });
      const allowedRelations : RelationMeta[] = MetadataStorage.instance.getAllowedRelationshipsFor(resourceTargetPrototype)
        .map((e) => {
          const resource = this.getResourceByClassName(e.options.otherResource);
          const mikroMeta = mikroEntity.relations.find((r) => r.name === e.propertyName);
          if (!resource || !mikroMeta) throw new Error('Cannot find resource ' + e.options.otherResource);
          return {
            mikroMeta,
            resource,
            name: e.propertyName
          }
        })

      const serializer = new ResourceSerializer();

      resourceRef.mikroEntity = mikroEntity;
      resourceRef.name = resource.options.entityName;
      resourceRef.attributes = allowedAttributes;
      resourceRef.relationships = allowedRelations;
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
