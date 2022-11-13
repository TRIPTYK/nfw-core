import type { RouterContext } from '@koa/router';
import { ExecutableGuard, ExecutableParam, ForbiddenError } from '@triptyk/nfw-http';
import type { ControllerContext } from '@triptyk/nfw-http/dist/src/types/controller-context.js';
import 'reflect-metadata';
import { AuthGuard } from '../src/guards/guard.js';

class FakeController {}

function setupContextAndGuardInstance () {
  const controllerInstance = new FakeController();
  const guard = new AuthGuard();
  const context: ControllerContext = {
    controllerAction: 'list',
    controllerInstance
  };
  return { context, guard };
}

function setupExecutableGuardWithOneParam (context: ControllerContext<any>, guard: AuthGuard, param: string) {
  const executableParam = new ExecutableParam(context, () => param);
  const executableGuard = new ExecutableGuard(guard, context, [executableParam]);
  return executableGuard;
}

test('Guard throws when no user is provided', async () => {
  const { context, guard } = setupContextAndGuardInstance();
  const executableGuard = setupExecutableGuardWithOneParam(context, guard, '');
  expect(() => executableGuard.execute({} as RouterContext)).rejects.toThrowError(ForbiddenError);
});

test('Guard does not throws when user admin is provided', async () => {
  const { context, guard } = setupContextAndGuardInstance();
  const executableGuard = setupExecutableGuardWithOneParam(context, guard, 'admin');
  await executableGuard.execute({} as RouterContext);
});
