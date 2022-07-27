import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { BadContentTypeError } from '../../errors/specific/bad-content-type.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../jsonapi.registry.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { ResourceSerializer } from '../../serializers/resource.serializer.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';

export const findAll = <TModel extends BaseEntity<TModel, any>>(resource: ResourceMeta<TModel>) => async (ctx: RouterContext) => {
  const jsonApiContext = {
    resource,
    koaContext: ctx
  } as JsonApiContext<TModel>;

  const service = container.resolve(resource.service);
  if (!validateContentType(ctx.headers['content-type'] ?? '')) {
    throw new BadContentTypeError();
  }
  if (ctx.headers['content-type'] !== ctx.header.accept) {
    throw new BadContentTypeError();
  }
  const query = ctx.query as Record<string, any>;
  const parser = container.resolve<QueryParser<TModel>>(QueryParser);
  const serializer = container.resolve<ResourceSerializer<TModel>>(resource.serializer);
  parser.context = jsonApiContext;
  parser.parse(query);
  const all = await service.findAll(parser, jsonApiContext);
  const asResource = all.map((e: any) => createResourceFrom(e.toJSON(), resource));
  const serialized = serializer.serialize(asResource, jsonApiContext);
  ctx.body = serialized;
  ctx.type = 'application/vnd.api+json';
}
