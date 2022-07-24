import type { JsonapiError } from './error.js';

/**
 * An error should be >= 400, so this is the lowest error code possible
 */
export class JsonapiErrorCollection {
  /**
     * Get the most generic error code for error
     */
  get generalErrorCode (): string {
    if (this.errors.length === 1) {
      return this.errors[0].code ?? '400';
    }
    const maxCode = Math.max(
      ...this.errors.map((c) => +(c.code ?? 400))
    );
    return (Math.floor(maxCode / 100) * 100).toString();
  }

  constructor (public errors: JsonapiError[] = []) {}
}
