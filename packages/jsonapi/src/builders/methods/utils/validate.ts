import { validate } from 'fastest-validator-decorators';
import type { Class, Constructor } from 'type-fest';
import { BadRequestError } from '../../../errors/bad-request.js';

export async function validateObject (validationClass: Class<unknown>, object: Record<string, unknown>) {
  // eslint-disable-next-line new-cap
  const validation = new validationClass();
  Object.assign(validation as any, object);
  const errors = await validate(validation as Constructor<any>);
  if (errors !== true) {
    throw errors.map((e) => {
      const thrown = new BadRequestError();
      thrown.code = 'ValidationError';
      thrown.detail = e.message;
      thrown.source = { pointer: `/data/attributes/${e.field}` };
      return thrown;
    });
  }
}
