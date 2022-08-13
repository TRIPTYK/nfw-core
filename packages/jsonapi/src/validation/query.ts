import {
  Schema,
  String,
  Custom,
  Field,
  Number,
  Nested
} from 'fastest-validator-decorators';

@Schema(true)
export class PageQuery {
  @Number()
  declare number: number;

  @Number()
  declare size: number;
}

@Schema(true)
export class JsonApiQueryValidation {
    @String({ optional: true })
  declare include?: string;

  @Custom({
    optional: true,
    async check (value: object | string, errors: {type: string; actual: object | string}[]) {
      if (typeof value !== 'object') {
        errors.push({
          type: 'Not an object',
          actual: value
        })
      } else {
        if (Object.values(value).some((v) => typeof v !== 'string')) {
          errors.push({
            type: 'Must be string',
            actual: value
          })
        }
      }
      return value;
    }
  })
    declare fields?: Record<string, string>;

  @Field({ optional: true, type: 'object' })
  declare filter?: Record<string, unknown>;

  @Nested({ optional: true })
  declare page?: PageQuery;

  @String({ optional: true })
  declare sort?: string;
}
