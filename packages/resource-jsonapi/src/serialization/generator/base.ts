import type JSONAPISerializer from 'json-api-serializer';
import type { ResourceSchema } from '../../interfaces/schema.js';
import type { ResourcesRegistry } from '../../registry/registry.js';

export abstract class BaseSerializerGenerator {
  protected processedTypes: string[] = [];

  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer,
  ) {}

  public generate<T extends ResourceSchema> (schema: T): void {
    const jsonApiSchema = this.baseSchemaAndWhitelist(schema);

    this.generateRelationships(jsonApiSchema, schema);
    this.serializer.register(schema.resourceType, jsonApiSchema);
  }

  protected generateRelationships<T extends ResourceSchema> (jsonApiSchema: JSONAPISerializer.Options, schema: T) {
    for (const [relationName, relationObject] of Object.entries(schema.relationships)) {
      if (relationObject !== undefined) {
        this.generateForRelation(jsonApiSchema, relationName, relationObject.type);
      }
    }
  }

  private generateForRelation (schema: JSONAPISerializer.Options, relationName: string, relationType: string) {
    const relationSchema = this.registry.getSchemaFor(relationType);

    schema.relationships![relationName] = {
      type: relationSchema.resourceType,
    };

    if (this.processedTypes.includes(relationSchema.resourceType)) {
      return;
    }

    this.processedTypes.push(relationSchema.resourceType);
    this.generate(relationSchema);
  }

  public abstract baseSchemaAndWhitelist<T extends ResourceSchema>(schema: T): JSONAPISerializer.Options
}
