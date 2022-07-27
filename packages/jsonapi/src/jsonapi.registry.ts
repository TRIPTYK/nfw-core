import type { BaseEntity, EntityClass, EntityProperty } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
import { inject, singleton } from '@triptyk/nfw-core';
import { databaseInjectionToken } from '@triptyk/nfw-mikro-orm';
import type { Resource } from './resource/base.resource.js';
import { ResourceSerializer } from './serializers/resource.serializer.js';
import { ResourceService } from './services/resource.service.js';
import { MetadataStorage } from './storage/metadata-storage.js';

export interface AttributeMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    name: keyof TResource,
    mikroMeta: EntityProperty<TModel>,
    resource: ResourceMeta<TModel, TResource>,
}

export interface RelationMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    resource: ResourceMeta<TModel, TResource>,
    mikroMeta: EntityProperty<TModel>,
    name :string,
}

export type ResourceModel<T extends Resource<any>> = T extends Resource<infer K> ? K : never;

export interface ResourceMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    resource: Class<Resource<TModel>>,
    /**
     * The name of the entity for JSON:API
     * Will be pluralized for endpoints
    */
    name: string,
    mikroEntity: TModel,
    attributes: AttributeMeta<TModel, TResource>[],
    relationships: RelationMeta<TModel, TResource>[],
    serializer: Class<ResourceSerializer<TModel>>,
    service: Class<ResourceService<TModel>>,
}

@singleton()
export class JsonApiRegistry {
  public resources = new Map<Class<Resource<any>>, ResourceMeta<any, any>>([]);

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

      const allowedAttributes: AttributeMeta<any, any>[] = MetadataStorage.instance.getAllowedAttributesFor(resourceTargetPrototype).map((e) => {
        const mikroMeta = Object.values(mikroEntity.properties).find((p) => p.name === e.propertyName);
        if (!mikroMeta) throw new Error('Cannot find meta for property ' + e.propertyName);
        return {
          mikroMeta,
          name: e.propertyName,
          resource: resourceRef
        }
      });
      const allowedRelations : RelationMeta<any, any>[] = MetadataStorage.instance.getAllowedRelationshipsFor(resourceTargetPrototype)
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

      resourceRef.mikroEntity = mikroEntity;
      resourceRef.name = resource.options.entityName;
      resourceRef.attributes = allowedAttributes;
      resourceRef.relationships = allowedRelations;
      resourceRef.serializer = ResourceSerializer;
      resourceRef.service = ResourceService;
      resourceRef.resource = resource.target

      Object.defineProperty(repository, 'meta', {
        value: resourceRef,
        writable: false
      });

      Object.freeze(resourceRef);
    }
  }
}
