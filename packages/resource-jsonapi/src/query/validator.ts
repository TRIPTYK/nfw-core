import type { JsonApiQuery } from './query.js';
import { FieldsValidator } from './validators/fields.validator.js';
import { IncludeValidator } from './validators/include.validator.js';
import { SortValidator } from './validators/sort.validator.js';
import { inject, injectable } from '@triptyk/nfw-core';

@injectable()
export class QueryValidator {
  public constructor (
    @inject(FieldsValidator) private fieldsValidator: FieldsValidator,
    @inject(IncludeValidator) private includesValidator: IncludeValidator,
    @inject(SortValidator) private sortValidator: SortValidator,
  ) {}

  public validate (type: string, query: JsonApiQuery) {
    this.fieldsValidator.validate(query.fields);
    this.includesValidator.validate(query.include, type);
    this.sortValidator.validate(query.sort, type);
  }
}
