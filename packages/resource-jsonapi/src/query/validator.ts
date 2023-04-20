import { ResourcesRegistry } from "../registry/registry";
import { JsonApiQuery } from "./query";
import { FilterValidator } from "./validators/filter.validator.js";
import { FieldsValidator } from "./validators/fields.validator.js";
import { IncludeValidator } from "./validators/include.validator.js";
import { SortValidator } from "./validators/sort.validator.js";


export class QueryValidator {
  constructor(private  registry: ResourcesRegistry, private type: string) {}

  public validate(query: JsonApiQuery) {
    new FieldsValidator(this.registry).validate(query.fields);
    new IncludeValidator(this.registry, this.type).validate(query.include);
    new SortValidator(this.registry).validate(query.sort, this.type);
    new FilterValidator(this.registry).validate(query.filter, this.type);
  }
}
