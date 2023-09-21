import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Query (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.query;
  }, 'query');
}
