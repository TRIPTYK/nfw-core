# Guards

You can also test the guard by only calling the method's instance. You will not get the exact behavior of the framework because if the guard's response is false, the framework will throw an error.

To reproduce the exact behavior, you will need to work with the `ExecutableGuard` class.

```ts title="demo-http/tests/guard.test.ts"
--8<-- "sandbox/demo-http/tests/guard.test.ts"
```

```ts title="demo-http/src/guards/guard.ts"
--8<-- "sandbox/demo-http/src/guards/guard.ts"
```
