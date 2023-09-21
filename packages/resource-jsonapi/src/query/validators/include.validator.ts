import { inject, injectable } from '@triptyk/nfw-core';
import { UnknownRelationInSchemaError } from '../../errors/unknown-relation.js';
import type { Resource } from '../../interfaces/resource.js';
import type { ResourceSchema } from '../../interfaces/schema.js';
import type { ResourcesRegistry } from '../../registry/registry.js';
import { ResourcesRegistryImpl } from '../../registry/registry.js';
import type { IncludeQuery } from '../query.js';

@injectable()
export class IncludeValidator {
  constructor (
    @inject(ResourcesRegistryImpl) private registry: ResourcesRegistry,
  ) {}

  public validate (includes: IncludeQuery[] | undefined, type: string) {
    if (includes === undefined) {
      return;
    }

    const baseResourceSchema = this.registry.getSchemaFor(type);
    this.throwOnNonPresenceInSchema(includes, baseResourceSchema, type);
    this.validateNestedRelationPresenceInSchema(includes, baseResourceSchema);
  }

  private validateNestedRelationPresenceInSchema (relations: IncludeQuery[], baseResourceSchema: ResourceSchema) {
    for (const relation of relations) {
      const [schema, relationType] = this.getSchemaAndTypeFromRelationName(relation.relationName, baseResourceSchema);
      this.throwOnNonPresenceInSchema(relation.nested, schema, relationType);
    }
  }

  private getSchemaAndTypeFromRelationName (relationName: string, baseResourceSchema: ResourceSchema): [ResourceSchema<Resource>, string] {
    const relationType = baseResourceSchema.relationships[relationName]!.type;
    return [this.registry.getSchemaFor(relationType), relationType];
  }

  // eslint-disable-next-line class-methods-use-this
  private throwOnNonPresenceInSchema (relations: IncludeQuery[], schema: ResourceSchema, type: string) {
    const allowedRelations = Object.keys(schema.relationships).filter(relation => schema.relationships[relation]!.serialize);
    const unallowedRelations = relations.filter(relation => !allowedRelations.includes(relation.relationName));

    if (unallowedRelations.length) {
      throw new UnknownRelationInSchemaError(`${unallowedRelations.map(relation => relation.relationName).join(',')} are not allowed for ${type}`, unallowedRelations);
    }
  }
}
