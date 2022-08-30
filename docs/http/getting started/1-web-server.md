# Creating the web server

First, we'll need to create your app with nfw-core's `createApplication`. 

The purpose of this function is to setup application's routing and register global elements.

The routing is made using [Koa Router](https://www.npmjs.com/package/koa-router).

!!! info
    Obviously, the middleware compatibles with NFW-core are Koa-like middleware.

Here's a basic application init.

```ts title="application.ts"
 async function init () {
  // Create the app
  const koaApp = await createApplication({
    server: new Koa(),
    controllers: [Area]
  });

  const port = 8001;

  koaApp.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

init();
```


`createApplication()` needs a `Koa` server and an array of controllers.

!!! important Important
    Every controller needs to be registered in his parent. In this case the parent is the application itself. But it can  also be another controller.