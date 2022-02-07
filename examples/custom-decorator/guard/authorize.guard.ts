import type { GuardInterface } from '@triptyk/nfw-core';
import { CurrentUser } from '../decorator/current-user.decorator.js';
import type { UserModel } from '../model/user.model.js';

export class AuthorizeGuard implements GuardInterface {
  can (@CurrentUser(false) currentUser: UserModel): boolean {
    if (currentUser?.username === 'amaury') {
      return true;
    }

    return false;
  }
}
