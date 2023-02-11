export interface ResourceValidator {
    isFieldValid(key: string, newValue: unknown, validator: string): boolean,
}
