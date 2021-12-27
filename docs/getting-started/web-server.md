First, we'll need to create the web-server itself with the createApplication function. 

The purpose of this function is to setup application's routing and register global elements.

The routing is made using [Koa Router](https://www.npmjs.com/package/koa-router).

!!! info
    Obviously, the middleware compatibles with NFW-core are Koa-like middleware.

```ts title="application.ts"
  import createApplication from '@triptyk/nfw-core';

  async function init () {
    /**
     * Create the app
     */
    const koaApp = await createApplication({
      controllers: [],
      globalGuards: [],
      globalMiddlewares: [],
      baseRoute: '/api/v1' // (1)
    });

    const port = 8001;

    koaApp.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }

  init();
```

1. The baseRoute is the prefix before all controller's routes.

