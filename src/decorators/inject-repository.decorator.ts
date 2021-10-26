import { BaseEntity, EntityRepository, MikroORM } from '@mikro-orm/core';
import { container, injectWithTransform } from 'tsyringe';
import { Transform } from 'tsyringe/dist/typings/types';
import { databaseInjectionToken } from '../index.js';
import { Class } from '../types/class.js';

class RepositoryTransformer<T> implements Transform<Class<T>, EntityRepository<any>> {
  public transform (_target: Class<unknown>, entityName: string) {
    /**
     * Resolve the connection
     */
    const connection = container.resolve<MikroORM>(databaseInjectionToken);
    /**
     * Fetch the repository of the entity manager
     */
    return connection.em.getRepository(entityName);
  }
}

export function InjectRepository (entity: Class<BaseEntity<any, any>>) {
  return injectWithTransform(entity, RepositoryTransformer, entity.name);
}
