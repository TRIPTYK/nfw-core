import {UnknownFieldInSchemaError} from "../errors/unknown-field";
import {UnknownRelationInSchemaError} from "../errors/unknown-relation";
import {ResourcesRegistry} from "../registry/registry";
import { IncludeQuery, JsonApiQuery } from "./query";

export class QueryValidator {
	constructor(private  registry: ResourcesRegistry, private type: string) {}

  public validate(query: JsonApiQuery) {
    this.validateFields(query.fields);
    this.validateIncludes(query.include);
  }

  private validateFields(fields: Record<string, string[]> | undefined) {
    if (fields === undefined) {
      return;
    }

    for (const type in fields) {
      this.validateFieldPresenceInSchema(fields, type)
    }
  }

  private validateFieldPresenceInSchema(fields: Record<string, string[]>, type: string) {
      const allowedFields = Object.keys(this.registry.getSchemaFor(type).attributes);
      const unallowedFields = fields[type].filter(field => !allowedFields.includes(field));

      if (unallowedFields.length) {
        throw new UnknownFieldInSchemaError(`${unallowedFields.join(',')} are not allowed for ${type}`, unallowedFields);
      }
  }

  private validateIncludes(includes: IncludeQuery[] | undefined) {
    if (includes === undefined) {
      return;
    }

    this.validateRelationPresenceInSchema(includes, this.type)
    this.validateNestedRelationPresenceInSchema(includes)
  }

  private validateNestedRelationPresenceInSchema(relations: IncludeQuery[]) {
   for (const relation of relations) {
    this.validateRelationPresenceInSchema(relation.nested, relation.relationName);
   } 
  }

  private validateRelationPresenceInSchema(relations: IncludeQuery[], type: string) {
      const allowedRelations = Object.keys(this.registry.getSchemaFor(type).relationships);
      const unallowedRelations = relations.filter(relation => !allowedRelations.includes(relation.relationName));

      if (unallowedRelations.length) {
        throw new UnknownRelationInSchemaError(`${unallowedRelations.map(relation => relation.relationName).join(',')} are not allowed for ${type}`, unallowedRelations);
      }
  }
}
