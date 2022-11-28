/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import type { ResourceInterface } from '../../src/interfaces/resource.js';

export class ArticleResource implements ResourceInterface {
  public constructor (
      public id: string
  ) {}

  public relationships () {
    return [];
  }

  public getName (): string {
    return 'articles';
  }

  public getId (): string {
    return this.id;
  }

  public attributes () {
    return {};
  }
}

export class UserResource implements ResourceInterface {
  public articles: ArticleResource[] = [];

  public constructor (
      public name: string,
      public id: string,
      public article?: ArticleResource
  ) {}

  public relationships () {
    return [
      { value: this.article, name: 'article' },
      { value: this.articles, name: 'articles' }
    ];
  }

  public attributes () {
    return {
      name: this.name
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public getName (): string {
    return 'users';
  }

  public getId (): string {
    return this.id;
  }
}
