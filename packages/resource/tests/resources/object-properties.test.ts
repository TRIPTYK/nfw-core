import { beforeEach, describe, expect, it } from 'vitest';
import type { ArticleResource } from './fake/article.js';
import { alwaysValidSchema, createArticleResource } from './fake/article.js';

let resource: ArticleResource;

describe('known properties access', () => {
  beforeEach(() => {
    resource = createArticleResource(alwaysValidSchema);
  });

  it('It should not refuse access to object defined properties that are not in schema', () => {
    // eslint-disable-next-line no-prototype-builtins
    resource.hasOwnProperty('1');
  });

  it('It should not refuse access to toJSON()', () => {
    resource.firstName = '123';
    expect(JSON.stringify(resource)).toStrictEqual('{"firstName":"123"}');
  });
});
