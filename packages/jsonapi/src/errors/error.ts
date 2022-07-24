import type { JsonApiErrorObject, LinksObject } from '../serializers/spec.interface.js';

export abstract class JsonapiError implements JsonApiErrorObject {
  id?: string;
  links?: LinksObject<'about' | 'type'>;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
        pointer?: `/${string}`,
        parameter?: string,
        header?: string,
    };

  meta?: Record<string, unknown>;
}
