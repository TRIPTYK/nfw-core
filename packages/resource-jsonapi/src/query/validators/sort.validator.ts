import {UnallowedSortFieldError} from "../../errors/unallowed-sort-field";
import {SchemaAttributes} from "../../interfaces/schema";
import {ResourcesRegistry} from "../../registry/registry";
import {SortQuery} from "../query";

export class SortValidator {
  constructor(private registry: ResourcesRegistry) {}

  public validate(sort: SortQuery | undefined, type: string) {
    if (sort === undefined) {
      return;
    }

    for (const field in sort) {
      this.recursiveSortValidation(sort, field, type);
    }
  }

  private recursiveSortValidation(sort: SortQuery, field: string, type: string) {
    const directionOrSortQuery = sort[field];

    if (directionOrSortQuery === "ASC" || directionOrSortQuery === "DESC") {
      return this.throwErrorOnFieldNotAllowedAsSort(type, sort);
    }
    return this.validate(directionOrSortQuery, field);
  }

  private throwErrorOnFieldNotAllowedAsSort(type: string, sort: SortQuery) {
    const allowedFieldAsSort = this.getAllowedFieldAsSort(type);
    const unallowedSortField = Object.keys(sort).filter(sortField => !allowedFieldAsSort.includes(sortField));

    if (unallowedSortField.length) {
      throw new UnallowedSortFieldError(`${unallowedSortField.join(',')} are not allowed as sort field for ${type}`, unallowedSortField);
    }
  }

  private getAllowedFieldAsSort(type: string) {
    const attributes = this.registry.getSchemaFor(type).attributes;
    return this.getAttributeWithSortTrue(attributes);
  }

  private getAttributeWithSortTrue(attributes: SchemaAttributes<Record<string, unknown>>) {
    return Object.keys(attributes).filter(attribute => this.isSortTrue(attributes, attribute))
  } 

  private isSortTrue(attributes: SchemaAttributes<Record<string, unknown>>, field: string) {
    return attributes[field] && attributes[field]?.sort === true
  }
}
