# Testing the whole action

Testing the whole controller method (guards + params + action + response handler) consists of generating the middleware associated with the controller method and calling it with a Koa context.

The magic class is the ControllerActionBuilder. It produces a middleware based on the decorators applied to it and the method name.

```ts
const action = new ControllerActionBuilder(
    {
      controllerAction: 'get',
      controllerInstance: controller
    }, // (1)
    container.resolve(MetadataStorage) // (2)
);
action.build(); // It builds the middleware.
```

1. The controller context (instance + action)
2. The metadata storage

```ts title="demo-http/tests/action.test.ts"
--8<-- "sandbox/demo-http/tests/action.test.ts"
```
