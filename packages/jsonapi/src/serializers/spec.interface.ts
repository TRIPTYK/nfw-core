export interface JsonApiTopLevel {
  data?:
    | (ResourceObject | ResourceIdentifierObject | null)
    | (ResourceObject[] | ResourceIdentifierObject[]),
  errors?: unknown[],
  meta?: Record<string, unknown>,
  jsonapi?: Record<string, unknown>,
  links?: LinksObject<
    ('self' | 'related' | 'describedBy') | PaginationLinksKeys
  >,
  included?: CompoundDocuments,
}

export type PaginationLinksKeys = 'first' | 'last' | 'prev' | 'next';

export interface ErrorObject {
  id: string,
}

export type CompoundDocuments = ResourceObject[];

export type LinksObject<Keys extends string> = Record<
  Keys,
  string | LinkObject | null
>;

export interface ResourceIdentifierObject {
  type: string,
  id?: string,
  lid?: string,
  meta?: Record<string, unknown>,
}

export interface LinkObject {
  href: string,
  rel?: string,
  describedBy?: string,
  title?: string,
  type?: string,
  hreflang?: string | string[],
  meta?: Record<string, unknown>,
}

export type AttributesObject = Record<string, unknown>;
export type RelationshipsObject = Record<string, RelationshipObject>;

export interface RelationshipObject {
  links?: LinksObject<'related' | 'self'>,
  meta?: Record<string, unknown>,
  data: ResourceLinkage,
}

export type ResourceLinkage =
  | null
  | ResourceIdentifierObject
  | ResourceIdentifierObject[];

export interface ResourceObject {
  id?: string,
  type?: string,
  attributes?: AttributesObject,
  relationships?: unknown,
  links?: LinksObject<string>,
  meta?: unknown,
}

/**
 * A server MAY choose to stop processing as soon as a problem is encountered, or it MAY continue processing and encounter multiple problems. For instance, a server might process multiple attributes and then return multiple validation problems in a single response.
 * When a server encounters multiple problems for a single request, the most generally applicable HTTP error code SHOULD be used in the response. For instance, 400 Bad Request might be appropriate for multiple 4xx errors or 500 Internal Server Error might be appropriate for multiple 5xx errors.
 */
export interface JsonApiErrorObject {
    /** a unique identifier for this particular occurrence of the problem. */
    id?: string,
    /**
     * a links object that MAY contain the following members:
        about: a link that leads to further details about this particular occurrence of the problem. When derefenced, this URI SHOULD return a human-readable description of the error.
        type: a link that identifies the type of error that this particular error is an instance of. This URI SHOULD be dereferencable to a human-readable explanation of the general error.
     */
    links?: LinksObject<'about' | 'type'>,
    /**
     *  the HTTP status code applicable to this problem, expressed as a string value. This SHOULD be provided.
     */
    status?: string,
    /**
     * an application-specific error code, expressed as a string value.
     */
    code?: string,
    /**
     * a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
     */
    title?: string,
    /**
     *  a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
     */
    detail?: string,
    /**
     * an object containing references to the primary source of the error. It SHOULD include one of the following members or be omitted:
     */
    source?: {
        /**
         * a JSON Pointer [RFC6901] to the value in the request document that caused the error [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. This MUST point to a value in the request document that exists; if it doesn’t, the client SHOULD simply ignore the pointer.
         */
        pointer?: `/${string}`,
        /**
         * a string indicating which URI query parameter caused the error.
         */
        parameter?: string,
        /**
         * a string indicating the name of a single request header which caused the error.
         */
        header?: string,
    },
    /**
     *  a meta object containing non-standard meta-information about the error.
     */
    meta?: Record<string, unknown>,
}
