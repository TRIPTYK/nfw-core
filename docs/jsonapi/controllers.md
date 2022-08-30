# Controllers

The controller is creating endpoints based on a `Resource`.

## Overview 

```ts
@JsonApiController(UserResource)
export class UserController {
    @JsonApiList()
    public async list () {}

    @JsonApiGet()
    public async get () {}

    @JsonApiCreate()
    public async create () {}

    @JsonApiUpdate()
    public async update () {}

    @JsonApiDelete()
    public async delete () {}

    @JsonApiGetRelationships()
    public async relationships () {}

    @JsonApiGetRelated()
    public async related () {}
}
```

Each method decorator creates a jsonapi endpoint.

!!! hint
    The controller can use `@UseMiddleware` from `@triptyk/nfw-http` on any jsonapi endpoint.

!!! hint
    Any `@triptyk/nfw-http` endpoints can also be applied in the controller's class.

Any jsonapi endpoint can be disabled by removing the corresponding method.

```ts title="A list only controller"
@JsonApiController(UserResource)
export class UserController {
    @JsonApiList()
    public async list () {}
}
```

!!! info
    The ADD/REMOVE/UPDATE relationships endpoints are currently not implemented.

    