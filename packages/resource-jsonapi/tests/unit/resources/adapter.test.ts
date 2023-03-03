import { test } from 'vitest';
import { ArticleAdapter } from '../../samples/article.js';

test('create a json:api entity to data-source', () => {
  const adapter = new ArticleAdapter();
  adapter.create();
});
