import { Controller, GET, DELETE, POST, Param, Body } from '@triptyk/nfw-core';

interface User {
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

@Controller('/users')
export class UsersController {
  @GET('/')
  list () {
    return users;
  }

  @DELETE('/:id')
  remove (@Param('id') id: string) {
    users = users.filter((u) => u.name !== id);
  }

  @POST('/')
  create (@Body() body: User) {
    users.push(body);
    return body;
  }

  @GET('/:id')
  get (@Param(':id') id: string) {
    return users.find((e) => e.name === id);
  }
}
