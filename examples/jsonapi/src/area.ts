import { UseMiddleware } from '@triptyk/nfw-core';
import { Controller } from '@triptyk/nfw-http';
import { requestContext } from '@triptyk/nfw-mikro-orm';
import { UserController } from './controllers/user.controller.js';

@Controller({
  controllers: [UserController],
  routeName: '/api/v1'
})
@UseMiddleware(requestContext)
export class Area {}
