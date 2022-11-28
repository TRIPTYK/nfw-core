/* eslint-disable class-methods-use-this */
import type { RegistryInterface } from '../src/interfaces/registry.js';
import type { ResourceSerializerInterface } from '../src/interfaces/resource-serializer.js';
import type { TopLevelSerializerInterface } from '../src/interfaces/top-level-serializer.js';
import { ResourceSerializer } from '../src/serializers/resource.js';
import { TopLevelSerializer } from '../src/serializers/top-level.js';
import { ArticleResource, UserResource } from './fake/resources.js';

const articlesSerializer: ResourceSerializerInterface = new ResourceSerializer();
const usersSerializer: ResourceSerializerInterface = new ResourceSerializer();

class CustomRegistry implements RegistryInterface {
  public registerSerializerFor (): void {}

  public serializerFor (resourceName: string): ResourceSerializerInterface | undefined {
    if (resourceName === 'articles') {
      return articlesSerializer;
    }
    if (resourceName === 'users') {
      return usersSerializer;
    }
  }
}

let userResource: UserResource;
let registry: RegistryInterface;
let serializer: TopLevelSerializerInterface;

beforeEach(() => {
  userResource = new UserResource('amaury', '3');
  registry = new CustomRegistry();
  serializer = new TopLevelSerializer(
    registry
  );
});

it('It serializes a resource to a top level document', () => {
  expect(serializer.serialize(userResource)).toStrictEqual({
    data: {
      type: 'users',
      id: '3',
      attributes: {
        name: 'amaury'
      },
      relationships: {
        articles: {
          links: {
            self: '/users/3/relationships/articles',
            related: '/users/3/articles'
          },
          data: []
        },
        article: {
          links: {
            self: '/users/3/relationships/article',
            related: '/users/3/article'
          }
        }
      }
    }
  });
});

it('It serializes a resource with its relationships', () => {
  userResource.article = new ArticleResource('3');

  expect(serializer.serialize(userResource)).toStrictEqual({
    data: {
      type: 'users',
      id: '3',
      attributes: {
        name: 'amaury'
      },
      relationships: {
        articles: {
          links: {
            self: '/users/3/relationships/articles',
            related: '/users/3/articles'
          },
          data: []
        },
        article: {
          links: {
            self: '/users/3/relationships/article',
            related: '/users/3/article'
          },
          data: {
            type: 'articles',
            data: '1'
          }
        }
      }
    },
    included: [
      {
        type: 'articles',
        id: '1',
        attributes: {}
      }
    ]
  });
});
