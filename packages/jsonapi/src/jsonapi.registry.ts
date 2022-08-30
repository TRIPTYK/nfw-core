import type { BaseEntity, EntityClass, EntityProperty } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { EntityMetadata, OperatorMap } from '@mikro-orm/core/typings.js';
import type { Class, Constructor, StringKeyOf } from 'type-fest';
import { instanceCachingFactory, container, inject, singleton } from '@triptyk/nfw-core';
import { ResourceDeserializer } from './deserializers/resource.deserializer.js';
import type { Resource } from './resource/base.resource.js';
import { ResourceSerializer } from './serializers/resource.serializer.js';
import { ResourceService } from './services/resource.service.js';
import { MetadataStorage } from './storage/metadata-storage.js';
import type { LinksObject } from './serializers/spec.interface.js';
import type { RoleServiceAuthorizer } from './services/role-authorizer.service.js';

export interface AttributeMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    name: StringKeyOf<TResource>,
    mikroMeta: EntityProperty<TModel>,
    resource: ResourceMeta<TModel>,
    isFetchable: boolean,
    allowedSortDirections: ('ASC' | 'DESC')[],
    updateable: boolean,
    createable: boolean,
    allowedFilters: false | Partial<Record<keyof OperatorMap<TModel>, unknown>>,
}

export interface RelationMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    resource: ResourceMeta<TModel>,
    mikroMeta: EntityProperty<TModel>,
    links?: (this: TResource) => LinksObject<string>,
    name : keyof TResource,
}

export interface ResourceMeta<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    resource: Class<Resource<TModel>>,
    /**
     * The name of the entity for JSON:API
     * Will be pluralized for endpoints
    */
    name: string,
    routes: {
      hasCreate?: boolean,
      hasUpdate?: boolean,
      hasList?: boolean,
      hasDelete?: boolean,
      hasGet?: boolean,
      hasRelationships?: boolean,
      hasRelated?: boolean,
    },
    mikroEntity: EntityMetadata<TModel>,
    attributes: AttributeMeta<TModel, TResource>[],
    relationships: RelationMeta<TModel>[],
}

export interface JsonApiRegistryInitOptions<T extends RoleServiceAuthorizer<any, any>> {
  apiPath: string,
  authorizer?: Constructor<T>,
}

@singleton()
export class JsonApiRegistry {
  public resources = new Map<Class<Resource<any>>, ResourceMeta<any, any>>([]);

  /**
   * Move this elsewhere ?
   */
  public declare apiPath: string;
  public authorizer?: JsonApiRegistryInitOptions<any>['authorizer'];

  public constructor (@inject(MikroORM) private orm: MikroORM) {}

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

  public init ({
    authorizer,
    apiPath
  } : JsonApiRegistryInitOptions<any>) {
    this.apiPath = apiPath;
    const mikroORMMetadataStorage = this.orm.getMetadata();
    const jsonApiMetadataStorage = MetadataStorage.instance;

    for (const resource of jsonApiMetadataStorage.resources) {
      this.resources.set(resource.target, {} as ResourceMeta<any, any>);
    }

    for (const resource of jsonApiMetadataStorage.resources) {
      const entityName = (resource.options.entity as EntityClass<any>).name;
      const mikroEntity = mikroORMMetadataStorage.find(entityName);
      const resourceRef = this.resources.get(resource.target)!;

      if (!mikroEntity) {
        throw new Error(`Entity data ${entityName} not found, is it registered in mikro-orm ?`);
      }
      const resourceTargetPrototype = (resource.target as Class<unknown>).prototype;

      const allowedAttributes: AttributeMeta<any, any>[] = jsonApiMetadataStorage.getAllowedAttributesFor(resourceTargetPrototype).map((e) => {
        const mikroMeta = Object.values(mikroEntity.properties).find((p) => p.name === e.propertyName);
        if (!mikroMeta) throw new Error('Cannot find meta for property ' + e.propertyName);

        let sortable = e.options?.sortable ?? [];

        if (sortable === true) {
          sortable = ['ASC', 'DESC'];
        }

        if (sortable === false) {
          sortable = [];
        }

        return {
          mikroMeta,
          name: e.propertyName,
          resource: resourceRef,
          updateable: e.options?.updateable ?? true,
          createable: e.options?.createable ?? true,
          allowedFilters: e.options?.filterable ?? {},
          isFetchable: e.options?.fetchable ?? true,

          allowedSortDirections: sortable as ('ASC' | 'DESC')[]
        }
      });

      const allowedRelations : RelationMeta<any>[] = jsonApiMetadataStorage.getAllowedRelationshipsFor(resourceTargetPrototype)
        .map((e) => {
          const resource = this.getResourceByClassName(e.options.otherResource);
          const mikroMeta = mikroEntity.relations.find((r) => r.name === e.propertyName);
          if (!resource || !mikroMeta) throw new Error('Cannot find resource ' + e.options.otherResource);
          return {
            mikroMeta,
            resource,
            links: e.options.links,
            name: e.propertyName as any
          }
        });

      // register service
      container.register(`service:${resource.options.entityName}`, {
        useFactory: instanceCachingFactory(c => {
          const instance = c.resolve(resource.options.service ?? ResourceService);
          instance.resourceMeta = resourceRef;
          return instance;
        })
      });

      // register serializer
      container.register(`serializer:${resource.options.entityName}`, {
        useFactory: instanceCachingFactory(c => {
          const instance = c.resolve(resource.options.serializer ?? ResourceSerializer);
          instance.resource = resourceRef;
          return instance;
        })
      });

      // register deserializer
      container.register(`deserializer:${resource.options.entityName}`, {
        useFactory: instanceCachingFactory(c => {
          const instance = c.resolve(resource.options.deserializer ?? ResourceDeserializer);
          instance.resource = resourceRef;
          return instance;
        })
      });

      // register repository
      container.register(`repository:${resource.options.entityName}`, {
        /**
         * Mikro Orm repository should behave like a scoped singleton
         */
        useFactory: () => this.orm.em.getRepository(mikroEntity.class)
      });

      container.register('authorizer', {
        useFactory: instanceCachingFactory(c => {
          if (!authorizer) {
            return undefined;
          }
          const instance = c.resolve(authorizer);
          return instance;
        })
      });

      resourceRef.mikroEntity = mikroEntity;
      resourceRef.routes = {}; // empty object because it is frozen after
      resourceRef.name = resource.options.entityName;
      resourceRef.attributes = allowedAttributes;
      resourceRef.relationships = allowedRelations;
      resourceRef.resource = resource.target;

      Object.freeze(resourceRef);
    }
  }
}
