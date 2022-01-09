import { Controller, GET, DELETE, POST, Param, Body, injectable, inject, UseGuard, UseResponseHandler, UseErrorHandler, UseNotFoundMiddleware, UseMiddleware, ALL } from '../../../../src/index.js';
import { ErrorHandler } from './error-handler.js';
import { HeadersGuard } from './guard.js';
import { NotFoundMiddleware } from './not-found-handler.js';
import { createPassMiddleware } from './pass-middleware.js';
import { MetaResponseHandler } from './response-handler.js';
import { User, UsersService } from './service.js';

@Controller('/users')
@UseGuard(HeadersGuard, 'authorization', '123', 'wrong auth')
@UseResponseHandler(MetaResponseHandler, 'Nothing to say')
@UseErrorHandler(ErrorHandler)
@UseNotFoundMiddleware(NotFoundMiddleware)
@UseMiddleware(createPassMiddleware('controller'))
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(UsersService) private usersService: UsersService) {}

  @GET('/')
  @UseGuard(HeadersGuard, 'user-agent', 'nfw-test', 'incorrect user-agent')
  @UseResponseHandler(MetaResponseHandler, 'Returns all users of the app')
  @UseMiddleware(createPassMiddleware('route-list'))
  list () {
    return this.usersService.getUsers();
  }

  @ALL('/all')
  all () {
    return 'all'
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
