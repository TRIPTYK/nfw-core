import { ResourcesRegistry } from "../registry/registry.js";
import { JsonApiQuery } from "./query.js";
import { FilterValidator } from "./validators/filter.validator.js";
import { FieldsValidator } from "./validators/fields.validator.js";
import { IncludeValidator } from "./validators/include.validator.js";
import { SortValidator } from "./validators/sort.validator.js";
import { inject, injectable } from "@triptyk/nfw-core";

@injectable()
export class QueryValidator {
  public constructor(
    @inject(FieldsValidator) private fieldsValidator: FieldsValidator,
    @inject(IncludeValidator) private includesValidator: IncludeValidator,
    @inject(SortValidator) private sortValidator: SortValidator,
    @inject(FilterValidator) private filterValidator: FilterValidator,
  ) {}

  public validate(type: string, query: JsonApiQuery) {
    this.fieldsValidator.validate(query.fields);
    this.includesValidator.validate(query.include,  type);
    this.sortValidator.validate(query.sort,type);
    this.filterValidator.validate(query.filter,type);
  }
}
