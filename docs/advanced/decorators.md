# Parameter decorators

Below is the complete list of decorators available in a [Controller-Context](/advanced/controller-context/).

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

