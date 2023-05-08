import JSONAPISerializer from "json-api-serializer";
import { ResourceSchema } from "../interfaces/schema.js";
import { ResourcesRegistry } from "../registry/registry.js";

export abstract class BaseSerializerGenerator {
  protected processedTypes: string[] = [];

  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer
  ) {}

  abstract baseSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(schema: T): JSONAPISerializer.Options 

  public generate<T extends ResourceSchema<Record<string, unknown>>>(schema: T): void {
    const jsonApiSchema = this.baseSchemaAndWhitelist(schema);

    this.generateRelationships(jsonApiSchema, schema);
    this.serializer.register(schema.type, jsonApiSchema);
  }

  protected generateRelationships<T extends ResourceSchema<Record<string, unknown>>>(jsonApiSchema: JSONAPISerializer.Options, schema: T) {
    for (const [relationName, relationObject] of Object.entries(schema.relationships)) {
      if (relationObject !== undefined) {
        this.generateForRelation(jsonApiSchema, relationName, relationObject.type);
      }
    }
  }

  private generateForRelation (schema: JSONAPISerializer.Options, relationName: string, relationType: string) {
    const relationSchema = this.registry.getSchemaFor(relationType);

    schema.relationships![relationName] = {
      type: relationSchema.type
    };

    if (this.processedTypes.includes(relationSchema.type)) {
      return;
    }

    this.processedTypes.push(relationSchema.type);
    this.generate(relationSchema);
  }
}

