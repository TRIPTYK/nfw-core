# Injection

injecting a MikroORM connection can be done by the help of `@inject` decorator from `@triptyk/nfw-core`.

```ts
@singleton()
class UserController {
    public constructor(
        @inject(MikroORM) public mikroOrm: MikroORM
    ) {}
}
```

## Injecting a repository

Injecting a repository can be achieved by using the `@injectRepository` decorator from `@triptyk/nfw-mikro-orm`.

```ts
@singleton()
class UserController {
    public constructor(
        @injectRepository(UserModel) public userRepository: EntityRepository<UserModel>
    ) {}
}
```
