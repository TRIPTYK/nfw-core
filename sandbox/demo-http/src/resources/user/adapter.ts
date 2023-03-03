import { EntityRepository } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { JsonApiResourceAdapter } from '@triptyk/nfw-resources';
import { UserModel } from '../../models/user.model.js';
import type { UserResource } from './resource.js';

@singleton()
export class UserResourceAdapter extends JsonApiResourceAdapter<UserResource> {
  constructor (
    @injectRepository(UserModel) public repository: EntityRepository<UserModel>
  ) {
    super();
  }

  async create (resource: UserResource): Promise<void> {
    const userModel = this.repository.create({
      name: resource.name,
      role: 'admin'
    });

    await this.repository.persistAndFlush(userModel);

    resource.id = userModel.name;
  }
}
