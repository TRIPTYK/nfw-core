import { injectable } from '@triptyk/nfw-core';
import type { NFWAbility, RoleServiceAuthorizer } from '@triptyk/nfw-jsonapi';
import type { UserModel } from '../models/user.model.js';
import { Ability, AbilityBuilder } from '@casl/ability';

@injectable()
export class UserAuthorizer implements RoleServiceAuthorizer<UserModel, UserModel['role']> {
  public admin (user: UserModel | undefined, { can }: AbilityBuilder<NFWAbility>) {
    can('manage', 'all');
  };

  public user (user: UserModel | undefined, { can }: AbilityBuilder<NFWAbility>) {
    can('read', 'users', {
      id: user?.id
    });
    can('update', 'users', {
      id: user?.id
    });
    can('create', 'users');
    can('read', 'articles');
  };

  public buildAbility (userReq: UserModel | undefined) {
    const builder = new AbilityBuilder(Ability<['create' | 'read' | 'update' | 'delete' | 'manage', any]>);
    const role = userReq?.role ?? 'user';

    if (typeof this[role] === 'function') {
      this[role](userReq, builder as any);
      return builder.build();
    }

    throw new Error(`Unknown role ${role}`);
  }
}
