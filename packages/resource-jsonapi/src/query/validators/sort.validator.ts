import { inject, injectable } from '@triptyk/nfw-core';
import { UnallowedSortFieldError } from '../../errors/unallowed-sort-field.js';
import type { ResourceSchema, SchemaAttributes } from '../../interfaces/schema.js';
import type { ResourcesRegistry } from '../../registry/registry.js';
import { ResourcesRegistryImpl } from '../../registry/registry.js';
import type { SortQuery } from '../query.js';
import type { Resource } from '../../interfaces/resource.js';

@injectable()
export class SortValidator {
  constructor (
    @inject(ResourcesRegistryImpl) private registry: ResourcesRegistry,
  ) {}

  public validate (sort: SortQuery | undefined, type: string) {
    if (sort === undefined) {
      return;
    }

    const rootSchema = this.registry.getSchemaFor(type);

    for (const field in sort) {
      this.recursiveSortValidation(sort, field, rootSchema);
    }
  }

  // eslint-disable-next-line max-statements
  private recursiveSortValidation (sort: SortQuery, field: string, schema: ResourceSchema<Resource>) {
    const directionOrSortQuery = sort[field];

    if (schema.relationships[field] && !schema.relationships[field]?.type) {
      throw new Error(`No type defined for relationship ${field}`);
    }

    const type = schema.relationships[field]?.type ?? schema.resourceType;

    const subSchema = this.registry.getSchemaFor(type);

    if (directionOrSortQuery === 'ASC' || directionOrSortQuery === 'DESC') {
      return this.throwErrorOnFieldNotAllowedAsSort(subSchema, sort);
    }

    return this.validate(directionOrSortQuery, type);
  }

  private throwErrorOnFieldNotAllowedAsSort (schema: ResourceSchema<Resource>, sort: SortQuery) {
    const allowedFieldAsSort = this.getAllowedFieldAsSort(schema);
    const schemaFields = Object.keys(schema.attributes).concat(Object.keys(schema.relationships));
    const unallowedSortField = Object.keys(sort).filter(sortField => !allowedFieldAsSort.includes(sortField));
    const unknownFields = Object.keys(sort).filter(sortField => !schemaFields.includes(sortField));

    if (unallowedSortField.length) {
      throw new UnallowedSortFieldError(`${unallowedSortField.join(',')} are not allowed as sort field for ${schema.resourceType}${unknownFields.length ? ` | Unknown fields: ${unknownFields}` : ''}`, unallowedSortField);
    }
  }

  private getAllowedFieldAsSort (schema: ResourceSchema<Resource>) {
    const attributes = schema.attributes;
    return this.getAttributeWithSortTrue(attributes);
  }

  private getAttributeWithSortTrue (attributes: SchemaAttributes) {
    return Object.keys(attributes).filter(attribute => this.isSortTrue(attributes, attribute));
  }

  // eslint-disable-next-line class-methods-use-this
  private isSortTrue (attributes: SchemaAttributes, field: string) {
    return attributes[field] && attributes[field]?.sort === true;
  }
}
