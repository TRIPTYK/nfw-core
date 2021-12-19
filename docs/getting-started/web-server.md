
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
      baseRoute: '/api/v1'
    });

    const port = 8001;

    koaApp.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }

  init();
```