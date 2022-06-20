/* eslint-disable new-cap */
import type { AnyEntity } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { QueryParser } from '../query-parser/query-parser.js';

export abstract class JsonApiRepository<T extends AnyEntity<T>> extends EntityRepository<T> {
  declare meta: ResourceMeta;

  async jsonApiList (query: QueryParser, jsonApiContext: JsonApiContext<T>) {
    const results = await this.findAll({
      populate: query.includes as any
    });
    return results;
  }
}
