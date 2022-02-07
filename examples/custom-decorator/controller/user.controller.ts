import { Controller, GET, UseGuard } from '@triptyk/nfw-core';
import { CurrentUser } from '../decorator/current-user.decorator.js';
import { AuthorizeGuard } from '../guard/authorize.guard.js';
import type { UserModel } from '../model/user.model.js';

@Controller('/users')
export class UsersController {
  @GET('/profile')
  @UseGuard(AuthorizeGuard)
  profile (@CurrentUser(false) currentUser: UserModel) {
    return currentUser;
  }
}
