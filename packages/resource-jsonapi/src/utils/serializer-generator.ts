import type JSONAPISerializer from 'json-api-serializer';
import { ResourceSchema } from '../interfaces/schema.js';
import type { ResourcesRegistry } from '../registry/registry.js';
import { filterForWhitelist } from './whitelist-filter.js';

abstract class AbstractSerializerGenerator {
  protected processedTypes: string[] = [];

  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer
  ) {}

  abstract getSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(schema: T): JSONAPISerializer.Options 

  public generate<T extends ResourceSchema<Record<string, unknown>>>(schema: T): void {
    const jsonApiSchema = this.getSchemaAndWhitelist(schema);

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

export class SerializerGenerator extends AbstractSerializerGenerator {
  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer
  ) {
    super(registry, serializer);
  }

  public getSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(schema: T): JSONAPISerializer.Options {
    return {
      relationships: {},
      whitelist: filterForWhitelist(schema.attributes, "serialize"),
    };
  }
}

export class DeserializerGenerator extends AbstractSerializerGenerator {
  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer
  ) {
    super(registry, serializer);
  }

  public getSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(schema: T): JSONAPISerializer.Options {
    return {
      relationships: {},
      whitelistOnDeserialize: filterForWhitelist(schema.attributes, "deserialize"),
    };
  }
}
