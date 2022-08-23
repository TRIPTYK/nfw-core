
import { Controller, UseMiddleware } from '@triptyk/nfw-http';
import { requestContext } from '@triptyk/nfw-mikro-orm';
import { DocumentController } from './controllers/document.controller.js';
import { UserController } from './controllers/user.controller.js';

@Controller({
  controllers: [UserController, DocumentController],
  routeName: '/api/v1'
})
@UseMiddleware(requestContext)
export class Area {}
