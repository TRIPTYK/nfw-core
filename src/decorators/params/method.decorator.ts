import { createCustomDecorator } from '../../index.js'

export function Method (this : Function) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.method;
  }, this.name);
}
