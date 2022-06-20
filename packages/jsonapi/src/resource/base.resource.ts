import type { ResourceMeta } from '../jsonapi.registry.js';

export type ResourceContext = Record<string, unknown>;

export abstract class Resource<T> {
  declare meta: ResourceMeta;
  declare id: string;
}
