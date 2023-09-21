import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Method (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.method;
  }, 'method');
}
