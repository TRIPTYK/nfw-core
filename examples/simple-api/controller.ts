import { Controller, GET, DELETE, POST, Param, Body, UseMiddleware, injectable, inject } from '@triptyk/nfw-core';
import { Middleware } from './middleware.js';
import { User, UsersService } from './service.js';

@Controller('/users')
@UseMiddleware(Middleware)
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @GET('/')
  list () {
    return this.usersService.getUsers();
  }

  @DELETE('/:name')
  remove (@Param('name') name: string) {
    this.usersService.removeUser(name);
  }

  @POST('/')
  create (@Body() body: User) {
    return this.usersService.addUser(body);
  }

  @GET('/:name')
  get (@Param(':name') name: string) {
    return this.usersService.getUser(name);
  }
}
