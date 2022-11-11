import 'reflect-metadata';
import { UsersController } from '../src/controllers/users.js';
import { UserNotFoundError } from '../src/errors/user-not-found.js';
import { UsersService } from '../src/service/users.js';

let service: UsersService;
let controller : UsersController;

beforeEach(() => {
  service = new UsersService();
  controller = new UsersController(
    service
  );
});

it('Throws error when /:name is not found', () => {
  expect(() => controller.get('amaury')).toThrowError(UserNotFoundError);
});

it('Returns the user when /:name is found', () => {
  const user = {
    name: 'amaury'
  };
  service.users.push(user);
  expect(controller.get(user.name)).toStrictEqual(user);
});
