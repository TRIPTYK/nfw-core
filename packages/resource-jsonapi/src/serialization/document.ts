import { Resource } from "../interfaces/resource.js";
import { ResourceSchema, SchemaAttribute, SchemaRelationship } from "../interfaces/schema.js";
import { IncludeQuery, JsonApiQuery } from "../query/query.js";
import { ResourcesRegistry } from "../registry/registry.js";
import { JsonApiResourceObject, Relationships } from "../types/jsonapi-spec.js";
import { extractSerializableAttributes } from "../utils/attributes-from-schema.js";
import { attributesFromSparseFields } from "../utils/attributes-from-sparse-fields.js";
import { serializableRelationships } from "../utils/serializable-relationships.js";

export class DocumentSerializer  {
    private included = new Map();

    public constructor(
      private registry: ResourcesRegistry,
      private query: JsonApiQuery
    ) {
  
    }
  
    public serializeTopLevelDocuments(resource: Resource | Resource[] | null, schema: ResourceSchema<Resource>) {
      if (Array.isArray(resource)) {
        return {
          data: resource.map((r) => this.serializeOneTopDocument(r, schema, this.query.include ?? [])),
          included:  this.included,
        }
      } 
      return {
        data: resource === null ? null : this.serializeOneTopDocument(resource, schema,  this.query.include ?? []),
        included:  this.included,
      }
    }
  
  private serializeOneTopDocument(resource: Resource, schema: ResourceSchema<Resource>, include: IncludeQuery[]) {
    const doc: JsonApiResourceObject<Resource> = {
      id: resource.id,
      type: schema.type,
      attributes: extractSerializableAttributes(resource, attributesFromSparseFields(schema, this.query.fields ?? {})),
      links: this.makeDocumentLinks(schema, resource),
      meta: undefined,
      relationships: undefined
    };

    let relationships: Relationships = this.makeRelationships(schema, resource, include);

    if (Object.keys(relationships).length > 0) {
      doc.relationships = relationships;
    }

    return doc;
  }

    private makeRelationships(schema: ResourceSchema<Resource>, resource: Resource, includeLevel: IncludeQuery[]) {
      let relationships: Relationships = {};
      const serializableRelationshipsArray = serializableRelationships(schema);

      for (const include of includeLevel) {
        const relationName = include.relationName;
        const relationshipValue = resource[relationName] as Resource | Resource[] | undefined | null;
        const relationDescriptor = serializableRelationshipsArray[relationName];
        if (relationshipValue !== undefined && relationDescriptor) {
          relationships[relationName] = Array.isArray(relationshipValue) ? 
            this.serializeManyRelationships(relationshipValue, relationDescriptor, include.nested): 
            this.serializeSingleRelationship(relationshipValue, relationDescriptor, include.nested);
        }
      }
      return relationships;
    }
  
    private serializeSingleRelationship(relationshipValue: Resource | null, relationDescriptor: SchemaRelationship, include: IncludeQuery[]) {
      if (relationshipValue) {
        this.addDocumentToIncluded(relationshipValue, this.registry.getSchemaFor(relationDescriptor!.type), include);
      }
      return {
        data: relationshipValue?.id ? {
          type: relationDescriptor.type,
          id: relationshipValue.id
        }: null,
        links: undefined,
        meta: undefined
      };
    }
  
    private serializeManyRelationships(relationshipValues: Resource[], relationDescriptor: SchemaRelationship, include: IncludeQuery[]) {
      for (const relationshipValue of relationshipValues) {
        this.addDocumentToIncluded(relationshipValue, this.registry.getSchemaFor(relationDescriptor!.type), include);
      }
      return {
        data: relationshipValues.filter((r) => r.id).map((relationshipValue) => ({
          type: relationDescriptor.type,
          id: relationshipValue.id!
        })),
        links: undefined,
        meta: undefined
      };
    }

      
    private addDocumentToIncluded(resource: Resource, schema: ResourceSchema,include: IncludeQuery[]) {
      const document = this.serializeOneTopDocument(resource, schema,include);
  
      if (resource.id && !this.included.has(resource.id)) {
       this.included.set(resource.id, document);
      }
  
      return document;
    }
  
    private makeDocumentLinks(schema: ResourceSchema<Resource>, resource: Resource) {
      return {
        self: `${this.registry.getConfig().host}/${schema.type}/${resource.id}`
      };
    }
  }