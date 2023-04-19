import {dir, log} from "console";
import {UnallowedSortField, UnallowedSortFieldError} from "../errors/unallowed-sort-field";
import { UnknownFieldInSchemaError } from "../errors/unknown-field";
import { UnknownRelationInSchemaError } from "../errors/unknown-relation";
import { ResourcesRegistry } from "../registry/registry";
import {ExecuteIfArgIsDefined} from "../utils/execute-if-args-are-defined";
import { IncludeQuery, JsonApiQuery, SortQuery } from "./query";

type DirectionOrSortQuery = SortQuery | "DESC" | "ASC";

export class QueryValidator {
  constructor(private  registry: ResourcesRegistry, private type: string) {}

  public validate(query: JsonApiQuery) {
    ExecuteIfArgIsDefined(this.validateFields.bind(this), query.fields);
    ExecuteIfArgIsDefined(this.validateInclude.bind(this), query.include);
    ExecuteIfArgIsDefined(this.validateSort.bind(this), query.sort);
  }

  private validateFields(fields: Record<string, string[]>) {
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

  private validateInclude(includes: IncludeQuery[]) {
    this.throwErrorOnRelationNotInSchema(includes, this.type)
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

  private validateSort(sort: SortQuery, type = this.type) {
    for (const field in sort) {
      this.recursiveSortValidation(sort, field, type);
    }
  }

  private recursiveSortValidation(sort: SortQuery, field: string, type: string) {
    const directionOrSortQuery = sort[field];
    if (this.isSortDirection(directionOrSortQuery)) {
      return this.throwErrorOnFieldNotAllowedAsSort(type, sort);
    }
    return this.validateSort(directionOrSortQuery as SortQuery, field);
  }

  private isSortDirection(directionOrSortQuery: DirectionOrSortQuery) {
    return directionOrSortQuery === "ASC" || directionOrSortQuery === "DESC"
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
    const allowedFieldAsSort = [];
    for (const field in attributes) {
      if (attributes[field] && attributes[field]?.sort === true) {
        allowedFieldAsSort.push(field);
      }
    }
    return allowedFieldAsSort;
  }
}
