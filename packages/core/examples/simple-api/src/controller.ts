import { Controller, GET, DELETE, POST, Param, Body, UseMiddleware, inject, UseResponseHandler } from '@triptyk/nfw-core';
import { Middleware } from './middleware.js';
import { MetaResponseHandler } from './response-handler.js';
import type { User } from './service.js';
import { UsersService } from './service.js';

@Controller({
  routing: {
    prefix: '/users'
  }
})
@UseMiddleware(Middleware)
@UseResponseHandler(MetaResponseHandler, 'Nothing to say')
export class UsersController {
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @GET('/')
  @UseResponseHandler(MetaResponseHandler, 'Returns all users of the app')
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
  get (@Param('name') name: string) {
    return this.usersService.getUser(name);
  }
}
