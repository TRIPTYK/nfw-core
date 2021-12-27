# Parameter decorators

Below is the complete list of decorators available in a [Controller Context](/advanced/controller-context/).

## Existing decorators

| Decorator  | Description |
| ------------- | ------------- |
| @Body()  | returns `ctx.request.body` or `ctx.body` if previous one is undefined  |
| @Param(name: string)  | Returns the value of an URL parameter (ex : `/:id`) |
| @Params()  | Returns all the url params |
| @Query()  | Returns all the query parameters |
| @QueryParam(name: string)  | Returns the value of a query param (ex : `/:id`) |
| @Ip()  | Returns `ctx.ip` |
| @Origin()  | Returns `ctx.origin` |
| @Method()  | Returns the HTTP Method `ctx.method` |
| @Ctx()  | Returns Koa-router `ctx` (`RouterContext`) |
| @Args()  | Special NFW decorator, it returns the args passed to a ResponseHandler or a Guard |
| @ControllerContext()  | Special NFW decorator, it returns the current [ControllerContext]() |

## Creating a custom decorator

You can add your own decorators using `createCustomDecorator(handle: (ctx: ControllerParamsContext) => unknown, name: string, cache = false, args: unknown[] = [])`.

- `handle` :  the function that will be executed to get a value for the decorator. This function passes the Koa context and the arguments passed to the decorator.
- `name` : The name of the decorator, will be used for caching.
- `cache` : Enable decorator caching.
- `args`: The arguments passed to the decorator

```ts title="decorator/current-user.decorator.ts"
import { MikroORM } from '@mikro-orm/core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'

export function  CurrentUser(this: unknown,  throwIfNotFound: boolean) {
  return createCustomDecorator(async ({ ctx , args }) => {
    const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
    const context = databaseConnection.em.getContext();
    const user = await context.getRepository(UserModel).findOne({ id: "amaury" });
    if (!user && throwIfNotFound) {
        throw new Error("User not found");
    }
    return user;
  }, 'current-user', true, [throwIfNotFound]);
}
```

The decorator can then be called like any other decorator in a [Controller Context](/advanced/controller-context/).

```ts title="controller/user.controller.ts"
import { Controller, GET, UseGuard } from '@triptyk/nfw-core';
import { CurrentUser } from '../decorator/current-user.decorator.js';
import { AuthorizeGuard } from '../guard/authorize.guard.js';
import { UserModel } from '../model/user.model.js';

@Controller('/users')
export class UsersController {
  @GET('/profile')
  @UseGuard(AuthorizeGuard)
  profile (@CurrentUser(false) currentUser: UserModel) {
    return currentUser;
  }
}
```

### Decorator caching

Let's analyse the line below : 

```ts
createCustomDecorator(
  handle,
  'current-user', // (1)
  true,  // (2)
  [throwIfNotFound] // (3)
);
```

1. The name of the decorator 'current-user'
2. Caching enabled
3. The array of arguments

You'll need to toggle the caching property to `true`.

The array of arguments will be concatenated with the name to form a hash in order to reuse the decorator's result.

For example, using the `@CurrentUser(false)` decorator will produce this hash : `current-userfalse`.

If `@CurrentUser(false)` is used in another place **in the same request**, the result will be reused instead of calling the handle again.

!!! warning
    The caching is request-wide, if you call the same endpoint again, it may not produce the same result.