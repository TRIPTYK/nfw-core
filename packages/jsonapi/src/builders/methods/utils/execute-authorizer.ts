import { subject } from '@casl/ability';
import type { AnyEntity } from '@mikro-orm/core';
import { ForbiddenError } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../../jsonapi.registry.js';
import type { Operations, RoleServiceAuthorizer } from '../../../services/role-authorizer.service.js';

// eslint-disable-next-line max-params
export async function executeAuthorizer (authorizer: RoleServiceAuthorizer<any> | undefined, action: Operations, jsonApiContext: JsonApiContext<any, any>, resource: ResourceMeta<any, any>, one: AnyEntity) {
  if (authorizer) {
    const ability = await authorizer.buildAbility(jsonApiContext);

    const can = ability.can(action, subject(resource.name, one));
    if (!can) {
      throw new ForbiddenError(`Cannot ${action} ${resource.name}`);
    }
  }
}
