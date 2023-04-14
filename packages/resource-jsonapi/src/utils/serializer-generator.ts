import type JSONAPISerializer from 'json-api-serializer';
import type { ResourceSchema, SchemaRelationship } from '../interfaces/schema';
import type { ResourcesRegistry } from '../registry/registry';
import {filterForWhitelist} from './whitelist-filter';

export class SerializerGenerator {
  private processedTypes: string[] = [];

  public constructor (
    private registry: ResourcesRegistry,
    private serializer: JSONAPISerializer
  ) {}

  public generate<T extends ResourceSchema<Record<string, unknown>>> (schema: T): void {
    const jsonApiSchema: JSONAPISerializer.Options = {
      relationships: {},
      whitelist: filterForWhitelist(schema.attributes, "serialize"),
      whitelistOnDeserialize: filterForWhitelist(schema.attributes, "deserialize"),
    };

    for (const [relationName, relationObject] of Object.entries(schema.relationships)) {
      if (relationObject) {
        this.generateForRelation(jsonApiSchema, relationName, (relationObject as SchemaRelationship).type);
      }
    }

    this.serializer.register(schema.type, jsonApiSchema);
  }

  private generateForRelation (schema: JSONAPISerializer.Options, relationName: string, relationType: string) {
    const relationSchema = this.registry.getSchemaFor(relationType) as ResourceSchema<{type: string}>;

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
