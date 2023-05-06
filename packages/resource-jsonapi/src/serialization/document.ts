import { Resource } from "../interfaces/resource.js";
import { ResourceSchema, SchemaRelationship } from "../interfaces/schema.js";
import { ResourcesRegistry } from "../registry/registry.js";
import { JsonApiResourceObject, Relationships } from "../types/jsonapi-spec.js";
import { extractSerializableAttributes } from "../utils/attributes-from-schema.js";
import { serializableRelationships } from "../utils/serializable-relationships.js";

export class DocumentSerializer  {
    private included = new Map();

    public constructor(
      private registry: ResourcesRegistry
    ) {
  
    }
  
    private addDocumentToIncluded(resource: Resource, schema: ResourceSchema) {
      const document = this.serializeOneTopDocument(resource, schema);
  
      if (resource.id && !this.included.has(resource.id)) {
       this.included.set(resource.id, document);
      }
  
      return document;
    }
  
    public serializeTopLevelDocuments(resource: Resource | Resource[] | null, schema: ResourceSchema<Resource>) {
      if (Array.isArray(resource)) {
        return {
          data: resource.map((r) => this.serializeOneTopDocument(r, schema)),
          included:  this.included,
        }
      } 
      return {
        data: resource === null ? null : this.serializeOneTopDocument(resource, schema),
        included:  this.included,
      }
    }
  
  private serializeOneTopDocument(resource: Resource, schema: ResourceSchema<Resource>) {
    const doc: JsonApiResourceObject<Resource> = {
      id: resource.id,
      type: schema.type,
      attributes: extractSerializableAttributes(resource, schema.attributes),
      links: this.makeDocumentLinks(schema, resource),
      meta: undefined,
      relationships: undefined
    };

    let relationships: Relationships = this.makeRelationships(schema, resource);

    if (Object.keys(relationships).length > 0) {
      doc.relationships = relationships;
    }

    return doc;
  }

    private makeRelationships(schema: ResourceSchema<Resource>, resource: Resource) {
      let relationships: Relationships = {};
  
      for (const [relationshipName, relationDescriptor] of Object.entries(serializableRelationships(schema))) {
        const relationshipValue = resource[relationshipName] as Resource | Resource[] | undefined | null;
        if (relationshipValue !== undefined) {
            relationships[relationshipName] = Array.isArray(relationshipValue) ? 
              this.serializeManyRelationships(relationshipValue, relationDescriptor!): 
              this.serializeSingleRelationship(relationshipValue, relationDescriptor!);
        }
      }
      return relationships;
    }
  
    private serializeSingleRelationship(relationshipValue: Resource | null, relationDescriptor: SchemaRelationship) {
      if (relationshipValue) {
        this.addDocumentToIncluded(relationshipValue, this.registry.getSchemaFor(relationDescriptor!.type));
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
  
    private serializeManyRelationships(relationshipValues: Resource[], relationDescriptor: SchemaRelationship) {
      for (const relationshipValue of relationshipValues) {
        this.addDocumentToIncluded(relationshipValue, this.registry.getSchemaFor(relationDescriptor!.type));
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
  
    private makeDocumentLinks(schema: ResourceSchema<Resource>, resource: Resource) {
      return {
        self: `${this.registry.getConfig().host}/${schema.type}/${resource.id}`
      };
    }
  }