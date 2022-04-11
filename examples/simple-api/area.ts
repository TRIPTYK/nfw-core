import { Area, UseGuard } from '@triptyk/nfw-core';
import { UsersController } from './controller.js';
import { IpGuard } from './guard.js';

@Area({
  controllers: [UsersController]
})
@UseGuard(IpGuard, '::1')
export class MainArea {
  // eslint-disable-next-line no-useless-constructor
  constructor () {}
}
