import { Entity, Property } from '@mikro-orm/core';

@Entity()
export class UserModel {
    @Property({
      type: 'string',
      primary: true
    })
  public declare name: string;

  @Property({
    type: 'string',
    default: 'admin'
  })
    public declare role: string;
}
