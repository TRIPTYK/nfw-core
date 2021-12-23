import { createCustomDecorator } from '../../index.js'

export function Ip (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, 'ip')
}
