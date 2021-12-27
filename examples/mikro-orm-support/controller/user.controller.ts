import { MikroORM } from '@mikro-orm/core';
import { Controller, databaseInjectionToken, GET, inject, injectable } from '@triptyk/nfw-core';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(databaseInjectionToken) private mikroORM: MikroORM) {}

  @GET('/meta')
  meta () {
    return this.mikroORM.getMetadata().find('UserModel')?.path;
  }
}
