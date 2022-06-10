import type { MikroORM } from '@mikro-orm/core';
import { RequestContext } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { Context, Next } from 'koa';
import { databaseInjectionToken } from '../init.js';

export async function requestContext (_ctx: Context, next: Next) {
  const connection = container.resolve<MikroORM>(databaseInjectionToken);
  await RequestContext.createAsync(connection.em, next);
}
