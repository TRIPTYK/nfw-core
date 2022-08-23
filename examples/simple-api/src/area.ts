
import { Controller } from '@triptyk/nfw-http';
import { UsersController } from './controller.js';

@Controller({
  controllers: [UsersController],
  routeName: '/api/v1'
})
export class Area {}
