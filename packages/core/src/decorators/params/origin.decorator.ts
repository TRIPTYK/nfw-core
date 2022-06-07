import { createCustomDecorator } from '../../index.js'

/**
 * Returns ctx.origin
 */
export function Origin (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.origin;
  }, 'origin')
}