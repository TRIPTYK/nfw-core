import { EntityRepository, wrap } from '@mikro-orm/core';
import { injectable, singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { createExistingResource } from '@triptyk/nfw-resources';
import { UserNotFoundError } from '../errors/user-not-found.js';
import { UserModel } from '../models/user.model.js';
import { userResourceSchema } from '../resources/user.js';

export interface User {
    name: string,
}

@singleton()
@injectable()
export class UsersService {
  public users : User[] = [{
    name: 'amaury'
  }];

  public constructor (
    @injectRepository(UserModel) private userRepository: EntityRepository<UserModel>
  ) {

  }

  public findAll () {
    return [...this.users];
  }

  public async findOne (name: string) {
    const user = await this.userRepository.findOne({
      name
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return createExistingResource(wrap(user).toObject(), userResourceSchema);
  }

  public createOne (user: User) {
    this.users.push({ ...user });
    return user;
  }

  public async deleteOne (name: string) {
    const found = await this.findOne(name);
    this.users = this.users.filter((u) => u !== found);
    return found;
  }
}
