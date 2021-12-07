import { createCustomDecorator } from '../../index.js'

export function Origin (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.origin;
  }, 'origin')
}
