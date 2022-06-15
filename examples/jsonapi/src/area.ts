import { Controller, UseMiddleware } from '@triptyk/nfw-core';
import { requestContext } from '@triptyk/nfw-mikro-orm';
import { UserController } from './controllers/user.controller.js';

@Controller({
  routing: '/api/v1',
  controllers: [UserController]
})
@UseMiddleware(requestContext)
export class Area {}
