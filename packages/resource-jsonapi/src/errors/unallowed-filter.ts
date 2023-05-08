export class UnallowedFilterError extends Error {
  public constructor (
        public message: string,
        public filters: string[],
  ) {
    super(message);
  }
}
