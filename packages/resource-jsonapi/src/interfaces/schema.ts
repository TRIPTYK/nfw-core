export type SchemaAttributeTypes = 'string' | 'number' | 'boolean' | 'bigint' | 'null' | 'object';

export interface SchemaAttribute {
  serialize: boolean,
  deserialize: boolean,
  sort?: boolean,
  filter?: boolean,
  type: SchemaAttributeTypes,
}

type Cardinality = 'has-many' | 'belongs-to';

export type SchemaAttributes<T extends Record<string, unknown>> = Partial<Record<keyof T, SchemaAttribute>>;

export interface SchemaRelationship {
  type: string,
  cardinality: Cardinality,
  serialize: boolean,
  deserialize: boolean,
};

export type SchemaRelationships<T extends Record<string, unknown>> = Partial<Record<keyof T, SchemaRelationship>>;

export interface ResourceSchema<T extends Record<string, unknown>> {
  type: string,
  attributes: SchemaAttributes<T>,
  relationships: SchemaRelationships<T>,
}
