import { Area } from '../../../../../src/decorators/area.decorator.js';
import { injectable } from '../../../../../src/index.js';
import { UsersController } from '../controllers/controller.js';
import { DecoratorsController } from '../controllers/decorators-controller.js';
import { MethodsController } from '../controllers/methods-controller.js';

@injectable()
@Area({
  controllers: [
    UsersController,
    DecoratorsController,
    MethodsController
  ]
})
export class MainArea {

}
