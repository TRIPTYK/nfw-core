import { inject, injectable } from "@triptyk/nfw-core";
import {UnknownFieldInSchemaError} from "../../errors/unknown-field.js";
import {ResourcesRegistry, ResourcesRegistryImpl} from "../../registry/registry.js";

@injectable()
export class FieldsValidator {
  constructor(
    @inject(ResourcesRegistryImpl) private registry: ResourcesRegistry
  ) {}

  public validate(fields: Record<string, string[]> | undefined) {
    for (const type in fields) {
      this.throwErrorOnFieldNotInAttributes(fields, type);
    }
  }

  private throwErrorOnFieldNotInAttributes(fields: Record<string, string[]>, type: string) {
    const allowedFields = Object.keys(this.registry.getSchemaFor(type).attributes);
    const unallowedFields = fields[type].filter(field => !allowedFields.includes(field));
    if (unallowedFields.length) {
      throw new UnknownFieldInSchemaError(`${unallowedFields.join(',')} are not allowed for ${type}`, unallowedFields);
    }
  }
}
