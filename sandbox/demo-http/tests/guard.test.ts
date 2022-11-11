import { callGuardWithParams, ForbiddenError } from '@triptyk/nfw-http';
import 'reflect-metadata';
import { AuthGuard } from '../src/guards/guard.js';

test('Guard throws when no user is provided', async () => {
  const guard = new AuthGuard();
  expect(() => callGuardWithParams(guard, ['user'])).rejects.toThrowError(ForbiddenError);
});

test('Guard does not throws when user admin is provided', async () => {
  const guard = new AuthGuard();
  await callGuardWithParams(guard, ['admin']);
});
