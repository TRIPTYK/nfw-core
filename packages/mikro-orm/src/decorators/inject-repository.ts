import type { AnyEntity, EntityRepository } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { injectWithTransform, container } from '@triptyk/nfw-core';
import type { Transform } from 'tsyringe/dist/typings/types';

class RepositoryTransformer<T> implements Transform<Class<T>, EntityRepository<any>> {
  public transform (_target: Class<unknown>, entityName: string) {
    /**
     * Resolve the connection
     */
    const connection = container.resolve(MikroORM);
    /**
     * Fetch the repository of the entity manager
     */
    return connection.em.getRepository(entityName);
  }
}

export function injectRepository (entity: Class<AnyEntity>) {
  return injectWithTransform(entity, RepositoryTransformer, entity.name);
}
