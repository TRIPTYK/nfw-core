import { inject, injectable } from "@triptyk/nfw-core";
import { UnknownRelationInSchemaError } from "../../errors/unknown-relation.js";
import { ResourcesRegistry, ResourcesRegistryImpl } from "../../registry/registry.js"
import { IncludeQuery } from "../query.js";

@injectable()
export class IncludeValidator {
  constructor(
    @inject(ResourcesRegistryImpl) private registry: ResourcesRegistry
  ) {}
  
  public validate(includes: IncludeQuery[] | undefined,  type: string) {
    if (includes === undefined) {
      return;
    }

    this.throwErrorOnRelationNotInSchema(includes, type)
    this.validateNestedRelationPresenceInSchema(includes)
  }

  private validateNestedRelationPresenceInSchema(relations: IncludeQuery[]) {
   for (const relation of relations) {
    this.throwErrorOnRelationNotInSchema(relation.nested, relation.relationName);
   } 
  }

  private throwErrorOnRelationNotInSchema(relations: IncludeQuery[], type: string) {
      const allowedRelations = Object.keys(this.registry.getSchemaFor(type).relationships);
      const unallowedRelations = relations.filter(relation => !allowedRelations.includes(relation.relationName));

      if (unallowedRelations.length) {
        throw new UnknownRelationInSchemaError(`${unallowedRelations.map(relation => relation.relationName).join(',')} are not allowed for ${type}`, unallowedRelations);
      }
  }
}