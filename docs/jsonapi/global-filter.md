# The context filter

In each request, a mikro-orm [@Filter](https://mikro-orm.io/docs/filters) 'context' is defined.

It allows you to create pseudo-views from the current jsonapi context.

```ts
@Entity()
@Filter({
  name: 'context',
  cond: ({ koaContext } : { jsonApiContext : JsonApiContext<any>}) => {
    // user can only get itself
    return { id: (koaContext.state.user as UserModel).id }
  }
})
export class UserModel extends BaseEntity<UserModel, 'id'> {}
```
