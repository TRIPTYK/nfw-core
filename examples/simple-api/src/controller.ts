
import { inject, injectable, UseMiddleware } from '@triptyk/nfw-core';
import { Controller, GET } from '@triptyk/nfw-http';
import { Middleware } from './middleware.js';
import { UsersService } from './service.js';

@Controller({
  routeName: '/users'
})
@UseMiddleware(Middleware)
@injectable()
export class UsersController {
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @GET('/')
  list () {
    return this.usersService.getUsers();
  }
}
