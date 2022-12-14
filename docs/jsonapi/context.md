# The jsonapi request context

In every request, a JsonApiContext object is created containing many practical informations.

```ts
{
    koaContext : RouterContext,
    query?: QueryParser<TModel>, 
    method: JsonApiMethod, 
    currentUser?: unknown,
    resource: ResourceMeta<TModel, TResource>,
}
```

1. The Koa context
2. The query parser
3. The current jsonapi method (GET/CREATE/UPDATE/...)
4. The current user for the request
5. The resource binded to this context

This object can be accessed in :

- resources
- controllers (via parameter decorators)
- deserializers
- serializers
- query parsers
