import { RouterContext } from '@koa/router';
import { inject } from '@triptyk/nfw-core';
import { Body, Controller, Ctx, POST, UseResponseHandler } from '@triptyk/nfw-http';
import type { JsonApiResourceRegistry } from '@triptyk/nfw-resources';
import { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import type { UserResource } from '../resources/user/resource.js';
import { RestResponseHandler } from '../response-handlers/rest.js';

@Controller({
  routeName: '/users'
})
@UseResponseHandler(RestResponseHandler)
export class UsersController {
  private resourceRegistry: JsonApiResourceRegistry<UserResource>;

  public constructor (
    @inject(JsonApiRegistryImpl) public registry: JsonApiRegistryImpl
  ) {
    this.resourceRegistry = registry.get('users') as JsonApiResourceRegistry<UserResource>;
  }

  @POST('/')
  public async list (
    @Body() body: Record<string, unknown>,
    @Ctx() koaContext: RouterContext
  ) {
    const userResource = await this.resourceRegistry.deserializer.deserialize(body);

    await userResource.validate();

    if (!userResource.can('amaury', 'create', koaContext)) {
      throw new Error('Unauthorized');
    }

    await this.resourceRegistry.adapter.create(userResource);

    return userResource.serialize();
  }
}
