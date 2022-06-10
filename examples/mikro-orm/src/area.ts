import type { EntityRepository } from '@mikro-orm/core';
import { Controller, GET, UseMiddleware } from '@triptyk/nfw-core';
import { injectRepository, requestContext } from '@triptyk/nfw-core-mikro-orm';
import { UserModel } from './models/user.model.js';

@Controller({
  routing: '/users'
})
@UseMiddleware(requestContext)
export class Area {
  constructor (@injectRepository(UserModel) private repo: EntityRepository<UserModel>) {}

  @GET('/')
  async list () {
    return this.repo.findAll();
  }
}