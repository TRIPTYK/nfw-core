Middleware are simple chained functions that have access to the request context and can choose to execute other downstream middlewares.

In NFW, middlewares are classes implementing the MiddlewareInterface. The MiddlewareInterface requires you to implement the "use" function which acts like a classic Koa middleware.

```ts title="middleware.ts"
import { RouterContext } from '@koa/router'
import { injectable, MiddlewareInterface } from '@triptyk/nfw-core';
import { Next } from 'koa';

export class Middleware implements MiddlewareInterface {
  async use (context: RouterContext, next: Next) {
    // eslint-disable-next-line no-console
    console.log(context.method, context.url, context.ip);
    await next();
  }
}
```

!!! info "Note"
    By default, a new middleware instance will be created for each place the middleware is used. You can change this behavior by using the `@singleton` decorator. [More infos](https://github.com/microsoft/tsyringe){:target="_blank"}

Middlewares are applied on an endpoint with the `@UseMiddleware` decorators.

Middleware can be applied at **application level** (globalMiddlewares), **controller level** and **route level**.

```ts title="application.ts" hl_lines="2 18"
import { Controller, GET, DELETE, POST, Param, Body, UseMiddleware } from '@triptyk/nfw-core';
import { Middleware } from './middleware.js';

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
@UseMiddleware(Middleware) // (1)
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

1. Middleware can also be a classic koa middleware like `(ctx,next) => ...`