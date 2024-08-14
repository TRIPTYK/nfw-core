import type { Configuration, IDatabaseDriver, Options } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';

// eslint-disable-next-line @foxglove/no-boolean-parameters
export async function init<D extends IDatabaseDriver = IDatabaseDriver> (options: Options<D> | Configuration<D>, module: 'sqlite' | 'postgresql' | 'mysql' | 'mariadb') {
  const { MikroORM: MikroORMImport } = await import(`@mikro-orm/${module}`);
  const connection = await MikroORMImport.init(options);
  container.register(MikroORM, {
    useValue: connection,
  });
  return connection;
}
