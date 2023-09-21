# Setup

The init method creates a MikroORM connection who is resolvable in the DI container.

```ts
import { init } from '@triptyk/nfw-mikro-orm';
import { container } from '@triptyk/nfw-core';
import { MikroORM } from '@mikro-orm/core';

await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: <entities>
});
// ...
container.resolve(MikroORM);
```