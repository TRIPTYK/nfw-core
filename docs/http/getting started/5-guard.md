# Guards

Guards are pieces of code that executes one by one before the controller action, if some guard throws an error or returns false, it will throw by default a ForbiddenError.
If you want to throw another Error, use `throw <error>` in the guard.

In the example below, i've created an IpGuard that rejects when the user ip is not authorized.

```ts title="guard.ts"
export class IpGuard implements GuardInterface {
  // (1)
  can (@Ip() ip: string, @Args() [allowedIp] : [string]) {
    return ip === allowedIp;
  }
}
```

1. Decorators can be used in guards the same way than in the controller action.

## Using a guard and the `@Args()` decorator

The guards can be applied at **controller** or **endpoint** level. For the controller and route level, you must use the `@UseGuard(GuardClass, ...args)` decorator.

The args passed to the `@UseGuard` will be passed to the guard and can be retrieved in the guard by using the `@Args()` decorator.

```ts title="controller.ts"
@Controller('/users')
@UseMiddleware(Middleware) 
@UseGuard(IpGuard, '::ff')
export class UsersController {
  // ...
}
```
