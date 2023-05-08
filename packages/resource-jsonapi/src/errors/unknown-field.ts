export class UnknownFieldInSchemaError extends Error {
  public constructor (
        public message: string,
        public fields: string[],
  ) {
    super(message);
  }
}
