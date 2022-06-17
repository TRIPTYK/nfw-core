import { createCustomDecorator } from '../../factories/custom-decorator.factory.js';

export function Method (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.method;
  }, 'method');
}
