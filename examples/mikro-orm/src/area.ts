
import { EntityRepository } from '@mikro-orm/core';
import { UseMiddleware } from '@triptyk/nfw-core';
import { Controller, GET } from '@triptyk/nfw-http';
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
