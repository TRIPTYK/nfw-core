import { createCustomDecorator } from '../../factories/custom-decorator.factory.js';

export function Query (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.query;
  }, 'query');
}
