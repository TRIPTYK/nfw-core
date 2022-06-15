import { Controller, GET, UseMiddleware, inject } from '@triptyk/nfw-core';
import { Middleware } from './middleware.js';
import { UsersService } from './service.js';

@Controller({
  routing: {
    prefix: '/users'
  }
})
@UseMiddleware(Middleware)
export class UsersController {
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @GET('/')
  list () {
    return this.usersService.getUsers();
  }
}
