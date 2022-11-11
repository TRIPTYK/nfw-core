import { singleton } from '@triptyk/nfw-core';

export interface User {
    name: string,
}

@singleton()
export class UsersService {
  public users : User[] = [];

  public findAll () {
    return [...this.users];
  }

  public findOne (name: string) {
    return this.users.find((u) => u.name === name);
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
