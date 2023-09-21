# Parameter decorators

Below is the complete list of decorators available in a [Controller Context](/nfw-core/advanced/controller-context/).

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
| @ControllerContext()  | Special NFW decorator, it returns the current [ControllerContext](/nfw-core/advanced/controller-context) infos (controllerAction and controllerInstance) |

## Creating a custom decorator

You can add your own decorators using `createCustomDecorator(handle: (ctx: ControllerParamsContext) => unknown, name: string)`.

- `handle` :  the function that will be executed to get a value for the decorator. This function passes the Koa context and the arguments passed to the decorator.
- `name` : The name of the decorator.

```ts title="decorator/current-user.decorator.ts"
export function  CurrentUser(this: unknown,  throwIfNotFound: boolean) {
  return createCustomDecorator(async ({ ctx , args }) => {
    const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
    const context = databaseConnection.em.getContext();
    const user = await context.getRepository(UserModel).findOne({ id: "amaury" });
    if (!user && throwIfNotFound) {
        throw new Error("User not found");
    }
    return user;
  }, 'current-user');
}
```

The decorator can then be called like any other decorator in a [Controller Context](/nfw-core/advanced/controller-context/).

```ts title="controller/user.controller.ts"
@Controller('/users')
export class UsersController {
  @GET('/profile')
  profile (@CurrentUser(false) currentUser: UserModel) {
    return currentUser;
  }
}
```

!!! danger
    At the moment, the response of the decorator is not cached. If a decorator is used once in the guard and once in the controller, it will be called twice.
