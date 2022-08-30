import type { Ability, AbilityBuilder } from '@casl/ability';
import type { AnyEntity, BaseEntity, EntityManager } from '@mikro-orm/core';

export type NFWAbility = Ability<['create' | 'read' | 'update' | 'delete' | 'manage', any]>;
export type DefinePermissions<T> = (user: T | undefined, builder: AbilityBuilder<NFWAbility>) => void;
export type AccessPermisions<T> = Record<'admin' | 'user', DefinePermissions<T>>;
export type EntityAbility<T extends AnyEntity> = (userReq: unknown | undefined | null, entity: T, entityManager: EntityManager) => Promise<NFWAbility>;

export type RoleServiceAuthorizer<U extends BaseEntity<any, any>, R extends string> = {
  [K in R]: DefinePermissions<U>;
} & {
  buildAbility(context: U) : NFWAbility,
};
