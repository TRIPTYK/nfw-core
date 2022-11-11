# Params

Usually, guards are created by using `createCustomDecorator(handle,name)`.

```ts title="demo-http/src/params/validated-body.ts"
--8<-- "sandbox/demo-http/src/params/validated-body.ts"
```

To test the behavior, externalize the `handle` method used as the first parameter.

```ts title="demo-http/tests/param.test.ts"
--8<-- "sandbox/demo-http/tests/param.test.ts"
```
