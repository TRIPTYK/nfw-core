import { EntityRepository } from '@mikro-orm/core';
import { Controller, GET } from '@triptyk/nfw-core';
import { JsonApiBuilder } from '@triptyk/nfw-jsonapi';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { UserModel } from '../models/user.model.js';
import { UserResource } from '../resources/user.resource.js';

@Controller({
  builder: {
    builder: JsonApiBuilder,
    args: [UserResource]
  }
})
export class UserController {
  constructor (@injectRepository(UserModel) private repo: EntityRepository<UserModel>) {}

    @GET('/')
  async list () {
    return this.repo.findAll();
  }
}
