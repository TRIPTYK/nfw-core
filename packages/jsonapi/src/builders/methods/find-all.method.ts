import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import { BadContentTypeError } from '../../errors/specific/bad-content-type.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../jsonapi.registry.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { JsonApiRepository } from '../../repository/jsonapi.repository.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';

export const findAll = (resource: ResourceMeta, repository: JsonApiRepository<any>) => async (ctx: RouterContext) => {
  const jsonApiContext = {
    resource,
    koaContext: ctx
  } as JsonApiContext<unknown>;
  if (!validateContentType(ctx.headers['content-type'] ?? '')) {
    throw new BadContentTypeError();
  }
  if (ctx.headers['content-type'] !== ctx.header.accept) {
    throw new BadContentTypeError();
  }
  const query = ctx.query as Record<string, any>;
  const parser = container.resolve(QueryParser);
  parser.context = jsonApiContext;
  parser.parse(query);
  const all = await repository.jsonApiList(parser, jsonApiContext);
  const asResource = all.map((e: any) => createResourceFrom(e.toJSON(), resource));
  const serialized = resource.serializer.serialize(asResource, jsonApiContext);
  ctx.body = serialized;
  ctx.type = 'application/vnd.api+json';
}
