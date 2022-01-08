# Guards

Guards are pieces of code that executes one by one before the controller action, if some guard throws an error or returns false, it will return by default a 403 forbidden error.
The code and the message returned can be customised in the Guard class.

In the example below, i've created an IpGuard that rejets when the user ip is not authorized. 

```ts title="guard.ts"
import { Args, GuardInterface, Ip } from '@triptyk/nfw-core';

export class IpGuard implements GuardInterface {
  // (1)
  can (@Ip() ip: string, @Args() [allowedIp] : [string]) {
    return ip === allowedIp;
  }

  code = 403;
  message = 'Your ip is not allowed';
}
```

1. Decorators can be used in guards the same way than in the controller action.

## Use the guard and the `@Args()` decorator

The guards can be applied at **controller**, **route** or **application** level. For the controller and route level, you must use the `@UseGuard(GuardClass, ...args)` decorator.

The args passed to the `@UseGuard` will be passed to the guard and can be retrieved in the guard by using the `@Args()` decorator. 

```ts title="controller.ts" hl_lines="2 8"
import { Controller, GET, DELETE, POST, Param, Body, UseMiddleware, injectable, inject, UseGuard } from '@triptyk/nfw-core';
import { IpGuard } from './guard.js';
import { Middleware } from './middleware.js';
import { User, UsersService } from './service.js';

@Controller('/users')
@UseMiddleware(Middleware)
@UseGuard(IpGuard, '::ff')
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
  get (@Param('name') name: string) {
    return this.usersService.getUser(name);
  }
}
```

