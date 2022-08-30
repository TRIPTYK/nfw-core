# Middlewares

Middlewares are simple chained functions that have access to the request context and can choose to execute other downstream middlewares.

In NFW, middlewares are classes implementing the MiddlewareInterface. The MiddlewareInterface requires you to implement the "use" function which acts like a classic Koa middleware.

```ts title="middleware.ts"
export class Middleware implements MiddlewareInterface {
  async use (context: RouterContext, next: Next) {
    console.log(context.method, context.url, context.ip);
    await next();
  }
}
```

!!! info "Note"
    By default, a new middleware instance will be created for each place the middleware is used. You can change this behavior by using the `@singleton` decorator. [More infos](https://github.com/microsoft/tsyringe){:target="_blank"}

Middlewares are applied on an endpoint with the `@UseMiddleware` decorators.

Middlewares can be applied at  **controller level** and **route level**.

```ts title="application.ts"
// ...

@Controller('/users')
@UseMiddleware(Middleware) // (1)
export class UsersController {
  // ...
}
```

1. Middleware can also be a classic koa middleware like `(ctx,next) => ...`