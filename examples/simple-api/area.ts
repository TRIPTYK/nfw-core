import { Area } from '@triptyk/nfw-core';
import { UsersController } from './controller.js';

@Area({
  controllers: [UsersController]
})
export class MainArea {
  // eslint-disable-next-line no-useless-constructor
  constructor () {}
}
