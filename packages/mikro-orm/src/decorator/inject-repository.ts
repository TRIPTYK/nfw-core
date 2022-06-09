import type { BaseEntity, EntityRepository } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from '@triptyk/nfw-core';
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

export function InjectRepository (entity: Class<BaseEntity<any, any>>) {
  return injectWithTransform(entity, RepositoryTransformer, entity.name);
}
