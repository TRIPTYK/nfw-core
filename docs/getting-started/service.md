# Service

There's no specific interfaces to declare a service, all you need to do is decorate your class with `@singleton`. The rest is up to you.

For this example, we're going to create a users service to manage CRUD of users.

## Create the service

```ts title="service.ts"
import { singleton } from 'tsyringe';

export interface User {
    name: string,
}

let users : User[] = [
  {
    name: 'Amaury'
  },
  {
    name: 'Gilles'
  }
];

@singleton()
export class UsersService {
  addUser (user: User) {
    users.push(user);
    return user;
  }

  removeUser (name: string) {
    users = users.filter((e) => e.name === name);
  }

  updateUser (name: string, body: Partial<User>) {
    const idx = users.findIndex((e) => e.name === name);

    if (idx === -1) {
      throw new Error('User not found');
    }

    return users[idx] = { ...users[idx], ...body };
  }

  getUser (name: string) {
    return users.find((e) => e.name === name);
  }

  getUsers () {
    return users;
  }
}
```

## Inject the service

For the service to be used you need to `@inject` it and mark the class as `@injectable`.

```ts title="controller.ts" hl_lines="7 10 14 19 24 29"
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

```