# Response Handler

Testing response handlers can be achieved by simply instantiating the response handler and calling the `handle` method.

!!! note
    Because the response handler does not return a value but instead set it to the ctx.body, you need to test the values against the koa context.

```ts title="demo-http/tests/response-handler.test.ts"
--8<-- "sandbox/demo-http/tests/response-handler.test.ts"
```

```ts title="demo-http/src/response-handlers/rest.ts"
--8<-- "sandbox/demo-http/src/response-handlers/rest.ts"
```
