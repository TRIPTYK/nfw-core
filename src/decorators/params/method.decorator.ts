import { createCustomDecorator } from '../../index.js'

export function Method (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.method;
  }, 'method');
}
