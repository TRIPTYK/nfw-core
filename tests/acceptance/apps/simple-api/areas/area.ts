
import { Controller } from '../../../../../src/index.js';
import { UsersController } from '../controllers/controller.js';
import { DecoratorsController } from '../controllers/decorators-controller.js';
import { MethodsController } from '../controllers/methods-controller.js';

@Controller({
  controllers: [
    UsersController,
    DecoratorsController,
    MethodsController
  ]
})
export class MainArea {}
