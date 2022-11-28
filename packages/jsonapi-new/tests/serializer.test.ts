/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import type { ResourceSerializerInterface } from '../src/interfaces/resource-serializer.js';
import { ResourceSerializer } from '../src/serializers/resource.js';
import { UserResource, ArticleResource } from './fake/resources.js';

let serializer: ResourceSerializerInterface;

beforeEach(() => {
  serializer = new ResourceSerializer();
});

test('It serializes a resource with no relationships', () => {
  const resource = new UserResource('amaury', '1');
  resource.article = undefined;

  expect(serializer.serialize(resource)).toStrictEqual({
    type: 'users',
    id: '1',
    attributes: {
      name: 'amaury'
    },
    relationships: {
      article: {
        links: {
          self: '/users/1/relationships/article',
          related: '/users/1/article'
        }
      },
      articles: {
        links: {
          self: '/users/1/relationships/articles',
          related: '/users/1/articles'
        },
        data: []
      }
    }
  });
});

test('It serializes a resource with relationships', () => {
  const articleResource = new ArticleResource('2');
  const resource = new UserResource('amaury', '1', articleResource);

  expect(serializer.serialize(resource)).toStrictEqual({
    type: 'users',
    id: '1',
    attributes: {
      name: 'amaury'
    },
    relationships: {
      article: {
        links: {
          self: '/users/1/relationships/article',
          related: '/users/1/article'
        },
        data: { type: 'articles', id: '2' }
      },
      articles: {
        links: {
          self: '/users/1/relationships/articles',
          related: '/users/1/articles'
        },
        data: []
      }
    }
  });
});
