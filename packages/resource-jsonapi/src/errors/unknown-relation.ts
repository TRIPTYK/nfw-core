import type { IncludeQuery } from '../query/query';

export class UnknownRelationInSchemaError extends Error {
  public constructor (
        public message: string,
        public relations: IncludeQuery[],
  ) {
    super(message);
  }
}
