import { singleton } from '@triptyk/nfw-core';
import { createExistingResource } from '@triptyk/nfw-resources';
import { UserNotFoundError } from '../errors/user-not-found.js';
import { userResourceSchema } from '../resources/user.js';

export interface User {
    name: string,
}

@singleton()
export class UsersService {
  public users : User[] = [{
    name: 'amaury'
  }];

  public findAll () {
    return [...this.users];
  }

  public findOne (name: string) {
    const user = this.users.find((u) => u.name === name);

    if (!user) {
      throw new UserNotFoundError();
    }

    return createExistingResource(user, userResourceSchema);
  }

  public createOne (user: User) {
    this.users.push({ ...user });
    return user;
  }

  public deleteOne (name: string) {
    const found = this.findOne(name);
    this.users = this.users.filter((u) => u !== found);
    return found;
  }
}
