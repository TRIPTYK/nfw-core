# Response Handlers

The purpose of the response handler is to handle the response returned by the controller action. If you use this, you need to handle the sending of the response by yourself.

In the example below, i've created a response handler that adds to the response some metadata. 

```ts title="response-handler.ts"
import { RouterContext } from '@koa/router';
import { Args, Ctx, Ip, Method, ResponseHandlerInterface } from '@triptyk/nfw-core';

export class MetaResponseHandler implements ResponseHandlerInterface {
  handle (previousResponse: unknown, @Ctx() ctx: RouterContext, @Method() method:string, @Ip() ip: string, @Args() [description]:[string]): void | Promise<void> {
    ctx.response.body = {
      data: controllerResponse,
      meta: {
        method,
        ip,
        description
      }
    }
  }
}
```

## Using the response handler

The response handler can be applied at **controller** and **route** level. You must use the `@UseResponseHandler(ResponseHabdler, ...args)` decorator.

The args passed to the `@UseResponseHandler` will be passed to the response handler and can be retrieved by using the `@Args()` decorator. 

```ts title="controller.ts"
@Controller('/users')
@UseMiddleware(Middleware)
@UseGuard(IpGuard, '::1')
@UseResponseHandler(MetaResponseHandler, 'Nothing to say')
export class UsersController {
  // ...
}
```

!!! info "Response handler order"
    The response handler closest to the route is used. 
    
    Ex: If a response handler is applied at route-level and another to the controller-level, the route-level one will be used.