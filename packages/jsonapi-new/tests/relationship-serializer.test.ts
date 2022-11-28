import { RelationshipSerializer } from '../src/serializers/relationship.js';
import { ArticleResource, UserResource } from './fake/resources.js';

it('Serializes an empty relationship', () => {
  const user = new UserResource('amaury', '1');
  user.article = undefined;
  const serializer = new RelationshipSerializer(
    user
  );
  expect(serializer.serialize({
    value: user.article!,
    name: 'article'
  })).toStrictEqual({
    links: {
      self: '/users/1/relationships/article',
      related: '/users/1/article'
    }
  });
});

it('Serializes a single relationship', () => {
  const user = new UserResource('amaury', '1');
  user.article = new ArticleResource('2');
  const serializer = new RelationshipSerializer(
    user
  );
  expect(serializer.serialize({
    name: 'article',
    value: user.article
  })).toStrictEqual({
    links: {
      self: '/users/1/relationships/article',
      related: '/users/1/article'
    },
    data: { type: 'articles', id: '2' }
  });
});

it('Serializes a null relationship', () => {
  const user = new UserResource('amaury', '1');
  const serializer = new RelationshipSerializer(
    user
  );
  expect(serializer.serialize({
    name: 'article',
    // eslint-disable-next-line unicorn/no-null
    value: null
  })).toStrictEqual({
    links: {
      self: '/users/1/relationships/article',
      related: '/users/1/article'
    },
    // eslint-disable-next-line unicorn/no-null
    data: null
  });
});

it('Serializes a many-relationship', () => {
  const user = new UserResource('amaury', '1');
  user.articles = [new ArticleResource('2')];
  const serializer = new RelationshipSerializer(
    user
  );
  expect(serializer.serialize({
    name: 'articles',
    value: user.articles
  })).toStrictEqual({
    links: {
      self: '/users/1/relationships/articles',
      related: '/users/1/articles'
    },
    data: [{ type: 'articles', id: '2' }]
  });
});
