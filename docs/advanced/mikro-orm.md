# MikroORM Support

Even if optionnal, NFW-Core supports MikroORM by passing a mikroORMConnection.

```ts
  const orm = await MikroORM.init({
    ... // MikroORM options
  });

  const koaApp = await createApplication({
    // ...
    mikroORMConnection: orm,
    mikroORMContext: true,
  });
```

## Injecting the MikroORM connection



## Injecting repositories
