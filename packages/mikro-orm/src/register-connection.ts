import type { MikroORMOptions } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';

export function registerDatabaseConnection (options: MikroORMOptions) {
  const connection = new MikroORM(options);
  container.register(MikroORM, {
    useValue: connection
  });
  return connection;
}
