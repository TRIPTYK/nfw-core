import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import 'reflect-metadata';
import type { ResourceService } from '../../src/index.js';
import { RelationshipEntityNotFoundError } from '../../src/index.js';
import type { ArticleModel } from './dummy-app/models/article.model.js';
import type { CommentModel } from './dummy-app/models/comment.model.js';

beforeEach(async () => {
  const { initApp } = await import('./dummy-app/init.js');
  await initApp();
});

test('Should throw error when a provided relationship does not exists', async () => {
  const commentsService = container.resolve('service:article') as ResourceService<ArticleModel>;
  expect.assertions(1);

  try {
    await commentsService.checkRelationshipsExistance({
      id: 'article',
      comments: ['156-5+9596-9+5']
    })
  } catch (e) {
    expect(e)
      .toBeInstanceOf(RelationshipEntityNotFoundError)
  }
});

test('Should throw error when a provided relationship does not exists BUT some exists', async () => {
  const commentsService = container.resolve('service:article') as ResourceService<ArticleModel>;
  expect.assertions(1);

  try {
    await commentsService.checkRelationshipsExistance({
      id: 'article',
      comments: ['156-5+9596-9+5', 'comment']
    })
  } catch (e) {
    expect(e)
      .toBeInstanceOf(RelationshipEntityNotFoundError)
  }
});

test('Should not throw error when all the provided relationship exists', async () => {
  const commentsService = container.resolve('service:article') as ResourceService<ArticleModel>;

  await commentsService.checkRelationshipsExistance({
    id: 'article',
    comments: ['comment']
  })
});

test('Should throw error when provided relationship does exists', async () => {
  const commentsService = container.resolve('service:comment') as ResourceService<CommentModel>;
  expect.assertions(1);

  try {
    await commentsService.checkRelationshipsExistance({
      id: 'comment',
      article: 'id'
    })
  } catch (e) {
    expect(e)
      .toBeInstanceOf(RelationshipEntityNotFoundError)
  }
});

test('Should not throw error when the provided relationship exists', async () => {
  const commentsService = container.resolve('service:comment') as ResourceService<CommentModel>;

  await commentsService.checkRelationshipsExistance({
    id: 'comment',
    article: 'article'
  })
});

afterEach(async () => {
  await container.resolve(MikroORM).close(true);
});
