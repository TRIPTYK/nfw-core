import { createCustomDecorator } from '../../index.js'

export function Query (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.query;
  }, 'query');
}
