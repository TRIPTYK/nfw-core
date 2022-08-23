# Create your own module 

## Builders

They control the generation of the routing for every controllers. They extends the `RouteBuilderInterface`.
The controllers can be nested, for example, a builder A can have multiple child controllers of builder B. And vice-versa.

```ts title="example-builder.ts"
export class BasicHttpBuilder implements RouteBuilderInterface {
   // (2)
  declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  async build (): Promise<Router> { // (1)
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);

    for (const endPointMeta of endpointsMeta) {
        router[endPointMeta.method](async (ctx, next) => {
            ctx.body = "hello";
        });
    }

    return controllerRouter;
  }

  async bindRouting (parentRouter: Router, router: Router): Promise<void> { // (3)
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }
}
```

1.  Build is the main entry point of the builder, it must return a Koa Router.
2.  Every builder has a context applied to it, the context contains the instance of the controller (singleton) and his metadata.
3.  After the router has been built, you need to glue manually the parent router and the current router.
