import type { JsonApiErrorObject, LinksObject } from '../serializers/spec.interface.js';

export class JsonapiError extends Error implements JsonApiErrorObject {
  public id?: string;
  public links?: LinksObject<'about' | 'type'>;
  public status?: string;
  public code?: string;
  public title?: string;
  public detail?: string;
  public source?: {
        pointer?: `/${string}`,
        parameter?: string,
        header?: string,
    };

  public meta?: Record<string, unknown>;

  public constructor (message?: string) {
    super(message);
    this.detail = message;
  }
}
