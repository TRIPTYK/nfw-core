import JSONAPISerializer from "json-api-serializer";
import { ResourceSchema } from "../../interfaces/schema.js";
import { ResourcesRegistry } from "../../registry/registry.js";
import { BaseSerializerGenerator } from "./base.js";

export class DeserializerGenerator extends BaseSerializerGenerator {
  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer
  ) {
    super(registry, serializer);
  }

  public baseSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>>(_schema: T): JSONAPISerializer.Options {
    return {
      relationships: {},
    };
  }
}
