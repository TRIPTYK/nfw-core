import type { MikroORM } from '@mikro-orm/core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core'
import { UserModel } from '../model/user.model.js';

export function CurrentUser (this: unknown, throwIfNotFound: boolean) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  return createCustomDecorator(async ({ ctx, args }) => {
    const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
    const context = databaseConnection.em.getContext();
    const user = await context.getRepository(UserModel).findOne({ id: ctx.query.user });
    if (!user && throwIfNotFound) {
      throw new Error('User not found');
    }
    return user;
  }, 'current-user', true, [throwIfNotFound]);
}
