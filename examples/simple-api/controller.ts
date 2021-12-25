import { Controller, GET, DELETE, POST, Param, Body, UseMiddleware, injectable, inject, UseGuard, UseResponseHandler } from '@triptyk/nfw-core';
import { IpGuard } from './guard.js';
import { Middleware } from './middleware.js';
import { MetaResponseHandler } from './response-handler.js';
import { User, UsersService } from './service.js';

@Controller('/users')
@UseMiddleware(Middleware)
@UseGuard(IpGuard, '::1')
@UseResponseHandler(MetaResponseHandler, 'Nothing to say')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
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
  get (@Param(':name') name: string) {
    return this.usersService.getUser(name);
  }
}
