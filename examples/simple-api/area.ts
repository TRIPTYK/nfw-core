import { Controller, ALL } from '@triptyk/nfw-core';
import { UsersController } from './controller.js';

@Controller({
  controllers: [UsersController]
})
export class Area {
  @ALL('/sub')
  public sub () {
    return 'sub';
  }
}
