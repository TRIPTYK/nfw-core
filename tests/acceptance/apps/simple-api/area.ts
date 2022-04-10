import { Area } from '../../../../src/decorators/area.decorator.js';
import { injectable } from '../../../../src/index.js';
import { UsersController } from './controller.js';

@injectable()
@Area({
  routeName: '/',
  controllers: [
    UsersController
  ]
})
export class MainAreaController {

}
