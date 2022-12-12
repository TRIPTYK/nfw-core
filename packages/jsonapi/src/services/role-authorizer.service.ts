import type { Ability, AbilityBuilder } from '@casl/ability';
import type { AnyEntity, EntityManager } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';

export type Operations = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type NFWAbility = Ability<[Operations, any]>;
export type DefinePermissions = (context: JsonApiContext<any>, builder: AbilityBuilder<NFWAbility>) => void;
export type AccessPermisions = Record<'admin' | 'user', DefinePermissions>;
export type EntityAbility<T extends AnyEntity> = (userReq: JsonApiContext<any>, entity: T, entityManager: EntityManager) => Promise<NFWAbility>;

export type RoleServiceAuthorizer<R extends string> = {
  [K in R]: DefinePermissions;
} & {
  buildAbility(context: JsonApiContext<any>) : NFWAbility | Promise<NFWAbility>,
};
