import { MikroORM, RequestContext } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { Context, Next } from 'koa';

export async function requestContext (_ctx: Context, next: Next) {
  const connection = container.resolve(MikroORM);
  await RequestContext.createAsync(connection.em, next);
}
