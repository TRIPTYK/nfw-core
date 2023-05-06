export interface JsonApiTopLevelDocument<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  data?: JsonApiResourceObject<T> | JsonApiResourceObject<T>[] | null; // an array is not possible in theory for deserialization, but maybe in a future version ?
  meta?: Record<string, unknown>;
  errors?: Record<string, unknown>[]; // no need to have more infos about errors
  jsonapi?: Record<string,unknown>;
  links?: {
    first?: string,
    last?: string,
    next?: string,
    previous?: string,
    self?: string
  };
  included? : JsonApiResourceObject[];
}

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

export type JsonApiResourceLinkage =
  | null
  | []
  | JsonApiResourceIdentifier
  | JsonApiResourceIdentifier[];

export interface JsonApiRelationshipObject {
  links?: {
    self?: string;
    related?: string;
  };
  data?: JsonApiResourceLinkage;
  meta?: Record<string, unknown>;
}

export type Relationships = Record<string, JsonApiRelationshipObject>;

export interface JsonApiResourceObject<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  id?: string; // optional for create
  type?: string;
  attributes?: T;
  relationships?: Relationships;
  links?: {
    self: string
  };
  meta?: Record<string, unknown>;
}