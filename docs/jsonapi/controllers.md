# Controllers

The controller is creating endpoints based on a `Resource`.

## Overview 

```ts
@JsonApiController(UserResource, {
  currentUser ({ koaContext }) {
    return koaContext.state.user;
  }
})
export class UsersController {
  constructor (
    @inject('service:users') public service: ResourceService<AdditionalCostModel>,
    @inject('authorizer') public authorizer: UserAuthorizer
  ) {}

  @JsonApiList()
  public async list (@Context() context: JsonApiContext<AdditionalCostModel>) {
    const [models, number] = await this.service.findAll(context);
    for (const r of models) {
      await executeAuthorizer(this.authorizer, 'read', context, context.resource, r);
    }
    return [models, number];
  }

  @JsonApiGet()
  public async get (@Context() context: JsonApiContext<AdditionalCostModel>) {
    const one = await this.service.findOne(context.koaContext.params.id, context);
    await executeAuthorizer(this.authorizer, 'read', context, context.resource, one);
    return one;
  }

  @JsonApiCreate({
    validateFunction: (resource) => validateSchema(ValidatedUser, resource.toPojo())
  })
  public async create (@BodyAsResource() bodyAsResource: Resource<AdditionalCostModel>, @Context() context: JsonApiContext<AdditionalCostModel>) {
    const original = await this.service.createOne(bodyAsResource, context);
    await executeAuthorizer(this.authorizer as never, 'create', context, context.resource, original);
    await this.service.repository.persistAndFlush(original);
    return this.service.findOne(original.id, context);
  }

  @JsonApiUpdate({
    validateFunction: (resource) => validateSchema(ValidatedUserUpdate, resource.toPojo())
  })
  public async update (@BodyAsResource() bodyAsResource: Resource<AdditionalCostModel>, @Context() context: JsonApiContext<AdditionalCostModel>) {
    const one = await this.service.updateOne(bodyAsResource, context);
    await executeAuthorizer(this.authorizer as never, 'update', context, context.resource, one);
    await this.service.repository.flush();
    return this.service.findOne(one.id, context);
  }

  @JsonApiDelete()
  public async delete (@Context() context: JsonApiContext<AdditionalCostModel>) {
    const one = await this.service.deleteOne(context.koaContext.params.id, context);
    await executeAuthorizer(this.authorizer as never, 'delete', context, context.resource, one);
    await this.service.repository.flush();
  }

  @JsonApiGetRelated()
  public related () {}

  @JsonApiGetRelationships()
  public relationships () {}
}
```

Each method decorator creates a jsonapi endpoint.

!!! hint
    The controller can use `@UseMiddleware` from `@triptyk/nfw-http` on any jsonapi endpoint.

## Method decorators

`@triptyk/nfw-jsonapi` exposes it's own set of method decorators such as:

### [`@JsonApiList()`](https://jsonapi.org/format/#fetching-resources)

- Must return `[Resource[], number]`

### [`@JsonApiGet()`](https://jsonapi.org/format/#fetching-resources)

- Must return a  `Resource`

### [`@JsonApiCreate()`](https://jsonapi.org/format/#crud)

- Must return a  `Resource`

### [`@JsonApiUpdate()`](https://jsonapi.org/format/#crud)

- Must return a  `Resource`

### [`@JsonApiDelete()`](https://jsonapi.org/format/#crud)

- Must return `undefined`

### [`@JsonApiGetRelated()`](https://jsonapi.org/format/#fetching-resources)

- Must return a `Resource`

### [`@JsonApiGetRelationships()`](https://jsonapi.org/format/#fetching-relationships)

- Must return a `Resource`

!!! info
    The ADD/REMOVE/UPDATE relationships endpoints are currently not implemented.

## Parameters decorators

!!! info
    `@triptyk/nfw-http` parameters decorators cannot be used there.

`@triptyk/nfw-jsonapi` exposes it's own set of parameters decorators such as:

- `@Context()`: the current `JsonApiContext`
- `@BodyAsResource()`: the `ctx.request.body` transformed as a resource object.
- `@Ctx()`: the current `koaContext`
