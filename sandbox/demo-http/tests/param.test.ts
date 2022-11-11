import 'reflect-metadata';
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { validatedBody } from '../src/params/validated-body.js';
import { userSchema } from '../src/validations/user.js';
import { ValidationError } from 'yup';

it('Throws error when schema is not valid', async () => {
  const fakeContext = {
    ctx: {
      request: {
        body: {}
      }
    }
  } as ControllerParamsContext<unknown>;
  expect(() => validatedBody(userSchema, fakeContext)).rejects.toThrowError(ValidationError);
});

it('Returns body when is valid', async () => {
  const fakeContext = {
    ctx: {
      request: {
        body: {
          name: 'Amaury'
        }
      }
    }
  } as ControllerParamsContext<unknown>;

  const body = await validatedBody(userSchema, fakeContext);
  expect(body).toStrictEqual(fakeContext.ctx.request.body);
});
