import type { Except, StringKeyOf } from 'type-fest';
import type { Resource } from './resource.js';

export type SchemaAttributeTypes = 'string' | 'number' | 'boolean' | 'bigint' | 'null' | 'object';

export interface SchemaAttribute {
  serialize: boolean,
  deserialize: boolean,
  sort?: boolean,
  type: SchemaAttributeTypes,
}

export type Cardinality = 'has-many' | 'belongs-to';

export type WithoutIdAndType<T extends Resource = Resource> = Except<T, 'type' | 'id'>;

export type SchemaAttributes<T extends Resource = Resource> = Partial<Record<StringKeyOf<WithoutIdAndType<T>>, SchemaAttribute>>;

export interface SchemaRelationship {
  type: string,
  cardinality: Cardinality,
  serialize: boolean,
  deserialize: boolean,
};

export type SchemaRelationships<T extends Resource = Resource> = Partial<Record<StringKeyOf<WithoutIdAndType<T>>, SchemaRelationship>>;

export interface ResourceSchema<T extends Resource = Resource> {
  type: Resource['type'],
  attributes: SchemaAttributes<T>,
  relationships: SchemaRelationships<T>,
}
