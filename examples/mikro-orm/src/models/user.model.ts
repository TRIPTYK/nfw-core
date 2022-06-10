import { BaseEntity, Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey({

    })
  declare id : string;
}
