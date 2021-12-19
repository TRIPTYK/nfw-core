
```ts title="controller.ts"
import { Controller, GET, DELETE, POST, Param, Body } from '@triptyk/nfw-core';

interface User {
    name: string,
}

let users : User[] = [
  {
    name: 'Amaury'
  },
  {
    name: 'Gilles'
  }
];

@Controller('/users')
export class UsersController {
  @GET('/')
  list () {
    return users;
  }

  @DELETE('/:id')
  remove (@Param('id') id: string) {
    users = users.filter((u) => u.name !== id);
  }

  @POST('/')
  create (@Body() body: User) {
    users.push(body);
    return body;
  }

  @GET('/:id')
  get (@Param(':id') id: string) {
    return users.find((e) => e.name === id);
  }
}

```


```ts title="application.ts" hl_lines="2 9"
import createApplication from '@triptyk/nfw-core';
import { UsersController } from './controller.js';

async function init () {
  /**
   * Create the app
   */
  const koaApp = await createApplication({
    controllers: [UsersController],
    globalGuards: [],
    globalMiddlewares: [],
    baseRoute: '/api/v1'
  });

  const port = 8001;

  koaApp.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

init();
```