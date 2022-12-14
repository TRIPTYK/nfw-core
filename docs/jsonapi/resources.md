# Resources

The resource is the main element of this framework.

## Purpose

- A resource defines a jsonapi document.
- A resource contains `attributes` and `relationships`.
- A resource is based on a MikroORM `Model`.
- A resource defines which fields should be serializable, deserializable, filterable, sortable and includeable.
- A resource defines the relationships with other resources.

```ts title="Example of a resource"
@JsonApiResource({
  entity: UserModel,
  entityName: 'users'
})
export class UserResource extends Resource<UserModel> {
  @Attribute({
    filterable: {
      $eq: true
    },
    sortable: ['ASC']
  })
  public declare id: string;

  @Attribute()
  public declare username: string;

  @Attribute()
  public declare role: string;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare articles: ArticleResource[];
}
```