export class UnallowedSortFieldError extends Error {
  public constructor (
        public message: string,
        public sortFields: string[],
  ) {
    super(message);
  }
}
