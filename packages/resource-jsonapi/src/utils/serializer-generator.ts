import type JSONAPISerializer from 'json-api-serializer';
import type { ResourcesRegistry, ResourceSchema } from 'resources';

export class SerializerGenerator {
  private processedTypes: string[] = [];

  public constructor (
      private registry: ResourcesRegistry,
      private serializer: JSONAPISerializer
  ) {}

  public generate<T extends ResourceSchema<any>> (schema: T): void {
    const jsonApiSchema: JSONAPISerializer.Options = {
      relationships: {}
    };

    for (const [relationName, relationType] of Object.entries(schema.relationships)) {
      if (relationType) {
        this.generateForRelation(jsonApiSchema, relationName, relationType);
      }
    }

    this.serializer.register(schema.type, jsonApiSchema);
  }

  private generateForRelation (schema: JSONAPISerializer.Options, relationName: string, relationType: string) {
    const relationSchema = this.registry.get(relationType!).schema as ResourceSchema<any>;

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
