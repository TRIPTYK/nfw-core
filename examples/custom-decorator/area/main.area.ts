import { Area } from '../../../dist/src/index.js';
import { UsersController } from '../controller/user.controller.js';

@Area({
  controllers: [UsersController]
})
export class MainArea {}
