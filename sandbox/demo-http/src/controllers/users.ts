import { inject } from '@triptyk/nfw-core';
import { Controller, GET, Param, POST, UseResponseHandler } from '@triptyk/nfw-http';
import { ValidatedBody } from '../params/validated-body.js';
import { RestResponseHandler } from '../response-handlers/rest.js';
import { User, UsersService } from '../services/users.js';
import { userSchema } from '../validations/user.js';

@Controller({
  routeName: '/users'
})
@UseResponseHandler(RestResponseHandler)
export class UsersController {
  public constructor (
    @inject(UsersService) public usersService: UsersService
  ) {}

  @GET('/:name')
  public get (@Param('name') param: string) {
    const user = this.usersService.findOne(param);

    console.log(user);

    return JSON.stringify(user);
  }

  @POST('/')
  public create (@ValidatedBody(userSchema) body: User) {
    const user = this.usersService.createOne(body);
    return user;
  }
}
