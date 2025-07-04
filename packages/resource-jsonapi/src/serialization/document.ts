import type { Resource } from '../interfaces/resource.js';
import type { ResourceSchema, SchemaRelationship, WithoutIdAndType } from '../interfaces/schema.js';
import type { IncludeQuery, JsonApiQuery } from '../query/query.js';
import type { ResourcesRegistry } from '../registry/registry.js';
import type { JsonApiResourceObject, Relationships } from '../types/jsonapi-spec.js';
import { extractSerializableAttributes } from '../utils/attributes-from-schema.js';
import { attributesFromSparseFields } from '../utils/attributes-from-sparse-fields.js';
import { serializableRelationships } from '../utils/serializable-relationships.js';

export class DocumentSerializer {
  private included = new Map();

  public constructor (
      private registry: ResourcesRegistry,
      private query: JsonApiQuery,
  ) {

  }

  public serializeTopLevelDocuments (resource: Resource | Resource[] | null) {
    if (Array.isArray(resource)) {
      return {
        data: resource.map((r) => this.serializeOneTopDocument(r, this.query.include ?? [])),
        included: this.included,
      };
    }
    return {
      // eslint-disable-next-line unicorn/no-null
      data: resource === null ? null : this.serializeOneTopDocument(resource, this.query.include ?? []),
      included: this.included,
    };
  }

  private serializeOneTopDocument (resource: Resource, include: IncludeQuery[]) {
    const schema = this.getSchemaFor(resource);

    const doc: JsonApiResourceObject<WithoutIdAndType<Resource>> = {
      id: resource.id,
      type: resource.resourceType,
      attributes: extractSerializableAttributes(resource, attributesFromSparseFields(schema, this.query.fields ?? {})),
      links: this.makeDocumentLinks(schema, resource),
      meta: undefined,
      relationships: undefined,
    };

    const relationships: Relationships = this.makeRelationships(schema, resource, include);

    if (Object.keys(relationships).length > 0) {
      doc.relationships = relationships;
    }

    return doc;
  }

  private getSchemaFor (resource: Resource) {
    if (!resource.resourceType) {
      throw new Error(`Resource ${resource} has no resourceType assigned`);
    }

    try {
      return this.registry.getSchemaFor(resource.resourceType);
    } catch (e) {
      throw new Error(`No schema found for resource type ${resource.resourceType}`);
    }
  }

  // eslint-disable-next-line max-statements, complexity
  private makeRelationships (schema: ResourceSchema<Resource>, resource: Resource, includeLevel: IncludeQuery[]) {
    const relationships: Relationships = {};
    const serializableRelationshipsArray = serializableRelationships(schema);

    for (const include of includeLevel) {
      const relationName = include.relationName;
      const relationshipValue = resource[relationName] as Resource | Resource[] | undefined | null;
      const relationDescriptor = serializableRelationshipsArray[relationName];
      if (relationshipValue !== undefined && relationDescriptor) {
        relationships[relationName] = Array.isArray(relationshipValue)
          ? this.serializeManyRelationships(relationshipValue, relationDescriptor, include.nested)
          : this.serializeSingleRelationship(relationshipValue, relationDescriptor, include.nested);
      }
    }
    return relationships;
  }

  private serializeSingleRelationship (relationshipValue: Resource | null, relationDescriptor: SchemaRelationship, include: IncludeQuery[]) {
    if (relationshipValue) {
      this.addDocumentToIncluded(relationshipValue, include);
    }
    return {
      data: relationshipValue?.id
        ? {
            type: relationDescriptor.type,
            id: relationshipValue.id,
          }
        // eslint-disable-next-line unicorn/no-null
        : null,
      links: undefined,
      meta: undefined,
    };
  }

  private serializeManyRelationships (relationshipValues: Resource[], relationDescriptor: SchemaRelationship, include: IncludeQuery[]) {
    for (const relationshipValue of relationshipValues) {
      this.addDocumentToIncluded(relationshipValue, include);
    }
    return {
      data: relationshipValues.filter((r) => r.id).map((relationshipValue) => ({
        type: relationDescriptor.type,
        id: relationshipValue.id!,
      })),
      links: undefined,
      meta: undefined,
    };
  }

  private addDocumentToIncluded (resource: Resource, include: IncludeQuery[]) {
    const document = this.serializeOneTopDocument(resource, include);

    const uniqueId = this.makeUniqueIncludedIdForResource(resource);
    if (resource.id && !this.included.has(uniqueId)) {
      this.included.set(uniqueId, document);
    }

    return document;
  }

  private makeDocumentLinks (schema: ResourceSchema<Resource>, resource: Resource) {
    return {
      self: `${this.registry.getConfig().host}/${schema.resourceType}/${resource.id}`,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private makeUniqueIncludedIdForResource (r: Resource) {
    return `${r.resourceType}_${r.id}`;
  }
}
