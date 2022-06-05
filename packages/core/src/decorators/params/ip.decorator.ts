import { createCustomDecorator } from '../../index.js'

/**
 * Returns the ctx.ip
 */
export function Ip (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, 'ip')
}
