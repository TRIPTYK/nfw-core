# Creating a 'real' controller

The controller is responsible of handling requests and returning a response to the client.

We'll setup a basic controller to handle CRUD operations on resource users.

## Creating the controller

In order to create a controller, decorate your class with the `@Controller` decorator.

```ts title="controller.ts"
interface User {
    name: string,
}

let users : User[] = [
  {
    name: 'Amaury'
  }
];

@Controller('/users')
export class UsersController {}
```

## Creating HTTP endpoints

To create an endpoint, you must use a decorator corresponding to the needed HTTP method.

```ts title="controller.ts"
interface User {
    name: string,
}

let users : User[] = [
  {
    name: 'Amaury'
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
```

### Usage of parameters decorators

Parameters decorators are parameters that returns a result based on the request.
Per example, above the `@Body()` decorator returns the equivalent of `ctx.request.body` and the `@Param("something")` is equivalent to `ctx.params[something]`.

!!! hint
    Parameters decorators can be much more complex than just being a shortcut.