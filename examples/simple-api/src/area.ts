
import { Controller } from '@triptyk/nfw-http';
import { injectable } from 'tsyringe';
import { UsersController } from './controller.js';

@Controller({
  controllers: [UsersController],
  routeName: '/api/v1'
})
@injectable()
export class Area {}
