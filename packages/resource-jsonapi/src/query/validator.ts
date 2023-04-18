import {UnknownFieldInSchemaError} from "../errors/unknown-field";
import { ResourceSchema } from "../interfaces/schema";
import { JsonApiQuery } from "./query";

export class QueryValidator<T extends Record<string, unknown>> {
	constructor(private  schema: ResourceSchema<T>) {}

  public validate(query: JsonApiQuery) {
    this.validateFields(query);
  }

  private validateFields(query: JsonApiQuery) {
    if (query.fields === undefined) {
      return;
    }

    for (const type in query.fields) {
      this.banane(query.fields, type)
    }
  }

  private banane(fields: Record<string, string[]>, type: string) {
      const keysArray = Object.keys(this.schema.attributes);
      const areFieldsAllowed = fields[type].some(field =>  keysArray.includes(field))

      if (!areFieldsAllowed) {
        const unallowedFields = fields[type].filter(field => !keysArray.includes(field));
        throw new UnknownFieldInSchemaError(`${unallowedFields.join(',')} are not allowed for ${type}`, unallowedFields);
      }

  }
}
