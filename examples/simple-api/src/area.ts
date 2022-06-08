import { Controller } from '@triptyk/nfw-core';
import { UsersController } from './controller.js';

@Controller({
  controllers: [UsersController],
  routing: {
    prefix: '/api/v1'
  }
})
export class Area {}
