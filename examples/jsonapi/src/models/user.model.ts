import { BaseEntity, Collection, Entity, Filter, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import type { JsonApiContext } from '@triptyk/nfw-jsonapi';
import { v4 } from 'uuid';
import type { ArticleModel } from './article.model.js';

@Entity()
@Filter({
  name: 'context',
  cond: ({ jsonApiContext } : { jsonApiContext : JsonApiContext<any>}) => {
    return { id: (jsonApiContext?.currentUser as UserModel).id }
  }
})
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
  public id : string = v4();

  @Property()
    public declare username : string;

    @Property()
  public declare role: 'admin' | 'user';

    @OneToMany('ArticleModel', 'writer')
    public articles = new Collection<ArticleModel>(this);
}
