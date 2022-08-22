
import { EntityRepository } from '@mikro-orm/core';
import { Controller, GET, UseMiddleware } from '@triptyk/nfw-http';
import { injectRepository, requestContext } from '@triptyk/nfw-mikro-orm';
import { UserModel } from './models/user.model.js';

@Controller({
  routeName: '/users'
})
@UseMiddleware(requestContext)
export class Area {
  constructor (@injectRepository(UserModel) private repo: EntityRepository<UserModel>) {}

  @GET('/')
  async list () {
    return this.repo.findAll();
  }
}
