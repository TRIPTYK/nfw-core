import { EntityRepository } from '@mikro-orm/core';
import { JsonApiController, JsonApiGet } from '@triptyk/nfw-jsonapi';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { UserModel } from '../models/user.model.js';
import { UserResource } from '../resources/user.resource.js';

@JsonApiController(UserResource)
export class UserController {
  constructor (@injectRepository(UserModel) private repo: EntityRepository<UserModel>) {}

  @JsonApiGet()
  async list () {
    return this.repo.findAll();
  }
}
