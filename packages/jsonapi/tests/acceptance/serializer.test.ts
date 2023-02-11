/* eslint-disable max-lines */
/* eslint-disable unicorn/no-null */
/* eslint-disable max-statements */
/* eslint-disable no-console */
import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { JsonApiContext, ResourceSerializer } from '../../src/index.js';
import { QueryParser, JsonApiRegistry, createResourceFrom, JsonApiMethod } from '../../src/index.js';
import type { ArticleModel } from './dummy-app/models/article.model.js';
import type { CommentModel } from './dummy-app/models/comment.model.js';
import { describe, expect, beforeEach, afterEach, it } from 'vitest';

beforeEach(async () => {
  const { initApp } = await import('./dummy-app/init.js');
  await initApp();
});

describe('Serializer test', () => {
  let context: JsonApiContext<any>;
  let resourceSerializer: ResourceSerializer<ArticleModel>;
  let articleResource: any;

  beforeEach(() => {
    resourceSerializer = container.resolve('serializer:article') as ResourceSerializer<ArticleModel>;
    context = {
      resource: resourceSerializer.resource,
      koaContext: {
        url: '/',
        params: {
          id: '3'
        } as any
      } as RouterContext,
      method: JsonApiMethod.GET
    };
    articleResource = createResourceFrom({
      id: '1',
      title: 'hello'
    }, resourceSerializer.resource, context);
  });

  describe('Serialize', () => {
    it('Serialize resource', async () => {
      const output = await resourceSerializer.serialize(articleResource, context);

      expect(output).toStrictEqual({
        jsonapi: { version: '1.0' },
        links: { self: '/' },
        data: {
          links: { self: '/api/v1/article/1' },
          type: 'article',
          attributes: {},
          id: '1',
          meta: undefined,
          relationships: {
            comments: {
              links: {
                related: undefined,
                self: undefined
              }
            },
            locale: {
              links: {
                related: undefined,
                self: undefined
              }
            }
          }
        },
        included: undefined,
        meta: undefined
      });
    });

    it('Serialize null', async () => {
      const output = await resourceSerializer.serialize(null as any, context);
      expect(output).toStrictEqual({ data: null, included: undefined, jsonapi: { version: '1.0' }, links: { self: '/' }, meta: undefined });
    });

    it('Serialize null resources in relationships', async () => {
      const commentResource = container.resolve(JsonApiRegistry).getResourceByName('comment')!;

      const parser = new QueryParser();
      parser.context = context;

      const parsed = await parser.parse({
        include: 'comments,locale'
      });

      context.query = parsed;

      const comment = createResourceFrom<CommentModel>({
        id: '1',
        title: 'hello'
      }, commentResource, context);

      articleResource.comments = [comment];
      articleResource.locale = null;

      const output = await resourceSerializer.serialize(articleResource, context);

      expect(output).toStrictEqual({
        jsonapi: { version: '1.0' },
        links: { self: '/' },
        meta: undefined,
        data: {
          id: '1',
          links: { self: '/api/v1/article/1' },
          type: 'article',
          attributes: {},
          meta: undefined,
          relationships: {
            comments: {
              links: {
                related: undefined,
                self: undefined
              },
              data: [{ type: 'comment', id: '1' }]
            },
            locale: {
              links: {
                related: undefined,
                self: undefined
              },
              data: null
            }
          }
        },
        included: [
          {
            id: '1',
            meta: undefined,
            links: { self: '/api/v1/comment/1' },
            type: 'comment',
            attributes: { title: 'hello' },
            relationships: {
              article: {
                links: {
                  related: undefined,
                  self: undefined
                }
              },
              locales: {
                links: {
                  related: undefined,
                  self: undefined
                }
              }
            }
          }
        ]
      });
    });
  });
  describe('SerializeRelationships', () => {
    it('Serializes null', async () => {
      const commentResource = container.resolve(JsonApiRegistry).getResourceByName('comment')!;

      const parser = new QueryParser();
      parser.context = context;

      const parsed = await parser.parse({
        include: 'comments,locale'
      });

      context.query = parsed;

      const comment = createResourceFrom<CommentModel>({
        id: '1',
        title: 'hello'
      }, commentResource, context);

      articleResource.comments = [comment];
      articleResource.locale = null;

      const output = await resourceSerializer.serializeRelationships(articleResource, context, undefined, 'locale' as any);

      expect(output).toStrictEqual({
        jsonapi: { version: '1.0' },
        links: { self: '/' },
        meta: undefined,
        data: null,
        included: [
          {
            id: '1',
            meta: undefined,
            links: { self: '/api/v1/comment/1' },
            type: 'comment',
            attributes: { title: 'hello' },
            relationships: {
              article: { links: { self: undefined, related: undefined } },
              locales: { links: { self: undefined, related: undefined } }
            }
          }
        ]
      });
    });
  });
});

afterEach(async () => {
  await container.resolve(MikroORM).close(true);
});
