import { createCustomDecorator } from '../../index.js'

export function Header (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.header;
  }, 'header');
}
