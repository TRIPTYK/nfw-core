# Error handling

There is no custom error handling at the moment, be you can easily make one using a `Middleware` !

```ts
export class Middleware implements MiddlewareInterface {
    async use (context: RouterContext, next: Next) {
        try {
            await next();
        }catch(e) {
            if (e instance ForbiddenError) {
                context.status = 403;
                context.body = 'Forbidden !';
                return;
            }
            context.status = 500;
            context.body = 'Internal Server Error!';
        }
    }
}
```