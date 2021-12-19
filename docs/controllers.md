# Controllers

A controller represents a router, which have endpoints.
Every endpoint has a **controller action**, which is a function with some decorators as parameters.   

## Quick Example : 

``` typescript
import { Controller, GET, DELETE, POST, Param, Body } from "@triptyk/nfw-core";

let users = [
    {
        name : "Amaury"
    },
    {
        name : "Gilles"
    }
];

@Controller("/users")
export class UsersController {
    @GET("/") 
    list() {
        return users; 
    }

    @DELETE("/:id") 
    remove(@Param("id") id: string) {
        users = users.filter((u) => u.name !== id);     
    }

    @POST("/")
    create(@Body() body: Record<string, string>) {
        users.push(body);
        return body;
    }

    @GET("/:id")
    get(@Param(":id") id: string) {
        return users.find((e) => e.name === id);
    }
}
```

## Controller action parameters
```ts

```

### Existing parameters
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
| @RouterContext()  | Returns Koa-router `ctx` (`RouterContext`) |
| @Args()  | Special NFW decorator, it returns the args passed to a ResponseHandler or a Guard |
| @ControllerContext()  | Special NFW decorator, it returns the current [ControllerContext]() |

### Controller Context

