import { UnallowedFilterError } from '../../errors/unallowed-filter.js';
import type { SchemaAttributes } from '../../interfaces/schema.js';
import type { ResourcesRegistry } from '../../registry/registry.js';
import type { FilterQuery } from '../query.js';

export class FilterValidator {
  constructor (private registry: ResourcesRegistry) {}

  public validate (filter: FilterQuery | undefined, type: string) {
    if (filter === undefined) {
      return;
    }

    this.throwErrorOnFieldNotAllowedAsFilter(filter, type);
  }

  private throwErrorOnFieldNotAllowedAsFilter (filter: FilterQuery, type: string) {
    const allowedFieldAsFilter = this.getAllowedFieldAsFilter(type);
    const unallowedSortField = Object.keys(filter).filter(sortField => !allowedFieldAsFilter.includes(sortField));

    if (unallowedSortField.length) {
      throw new UnallowedFilterError(`${unallowedSortField.join(',')} are not allowed as filter for ${type}`, unallowedSortField);
    }
  }

  private getAllowedFieldAsFilter (type: string) {
    const attributes = this.registry.getSchemaFor(type).attributes;
    return this.getAttributeWithSortTrue(attributes);
  }

  private getAttributeWithSortTrue (attributes: SchemaAttributes<Record<string, unknown>>) {
    return Object.keys(attributes).filter(attribute => this.isFilterTrue(attributes, attribute));
  }

  // eslint-disable-next-line class-methods-use-this
  private isFilterTrue (attributes: SchemaAttributes<Record<string, unknown>>, field: string) {
    return attributes[field] && attributes[field]?.filter === true;
  }
}
