# MikroORM Support

Even if optionnal, NFW-Core supports MikroORM by passing a mikroORMConnection to the app.

```ts
  const orm = await MikroORM.init({
    ... // MikroORM options
  });

  const koaApp = await createApplication({
    // ...
    mikroORMConnection: orm,
    mikroORMContext: true, // (1) 
  });
```

1. See [MikroORM request context](https://mikro-orm.io/docs/identity-map/#why-is-request-context-needed)

## Injecting the MikroORM connection

You can use `@inject(databaseInjectionToken)` that resolves to the `mikroORMConnection` you passed in the `createApplication` function.

```ts title="controller/user.controller.ts"
import { MikroORM } from '@mikro-orm/core';
import { Controller, databaseInjectionToken, GET, inject, injectable } from '@triptyk/nfw-core';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(databaseInjectionToken) private mikroORM: MikroORM) {}

  @GET('/meta')
  meta () {
    return this.mikroORM.getMetadata().find('UserModel')?.path;
  }
}
```

## Injecting repositories

You can use `@InjectRepository(<Model>)`.

```ts title="controller/user.controller.ts"
import { EntityRepository } from '@mikro-orm/sqlite';
import { Controller, GET, injectable, InjectRepository } from '@triptyk/nfw-core';
import { UserModel } from '../model/user.model.js';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: EntityRepository<UserModel>) {}

  @GET('/')
  list () {
    return this.userRepository.find({});
  }
}
```