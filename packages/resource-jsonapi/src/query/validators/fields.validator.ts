import { inject, injectable } from '@triptyk/nfw-core';
import { UnknownFieldInSchemaError } from '../../errors/unknown-field.js';
import type { ResourcesRegistry } from '../../registry/registry.js';
import { ResourcesRegistryImpl } from '../../registry/registry.js';

@injectable()
export class FieldsValidator {
  constructor (
    @inject(ResourcesRegistryImpl) private registry: ResourcesRegistry,
  ) {}

  public validate (fields: Record<string, string[]> | undefined) {
    for (const type in fields) {
      this.throwErrorOnFieldNotInAttributes(fields, type);
    }
  }

  private throwErrorOnFieldNotInAttributes (fields: Record<string, string[]>, type: string) {
    const schema = this.registry.getSchemaFor(type);
    const allowedFields = Object.keys(schema.attributes).filter(key => schema.attributes[key]?.serialize);
    const unallowedFields = fields[type].filter(field => !allowedFields.includes(field));

    if (unallowedFields.length) {
      throw new UnknownFieldInSchemaError(`${unallowedFields.join(',')} are not allowed for ${type}`, unallowedFields);
    }
  }
}
