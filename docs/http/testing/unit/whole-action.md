# Testing the whole action

Testing the whole controller method (guards + params + action + response handler) consists of generating the middleware associated with the controller method and calling it with a Koa context.

The magic class is the ControllerActionBuilder. It produces a middleware based on the decorators applied to it and the method name.

```ts
const action = new ControllerActionBuilder(
    controller, // (1)
    container.resolve(MetadataStorage),// (2)
    'get'// (3)
);
action.build(); // It builds the middleware.
```

1. The controller instance
2. The metadata storage
3. The controller method to test

```ts title="demo-http/tests/action.test.ts"
--8<-- "sandbox/demo-http/tests/action.test.ts"
```
