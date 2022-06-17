
import { inject, injectable } from '@triptyk/nfw-core';
import { Controller, GET, UseMiddleware } from '@triptyk/nfw-http';
import { Middleware } from './middleware.js';
import { UsersService } from './service.js';

@Controller({
  routeName: '/users'
})
@injectable()
export class UsersController {
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @UseMiddleware(Middleware)
  @GET('/')
  list () {
    return this.usersService.getUsers();
  }
}
