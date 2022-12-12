import type { ResourceMeta } from '../../../jsonapi.registry.js';

export function validateOneControllerResponse (res: unknown, resource: ResourceMeta<any, any>) {
  if (res && !(res instanceof resource.mikroEntity.class)) {
    throw new Error('Controller must return an instance of entity !');
  }
}
