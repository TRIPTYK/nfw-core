export class UnknownFieldInSchemaError extends Error {
    public constructor(
        public message: string,
        public field: string
    ) {
        super(message);
    }
}