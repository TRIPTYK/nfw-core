import type { GuardInterface } from '@triptyk/nfw-core';
import { Args, Ip } from '@triptyk/nfw-core';

export class IpGuard implements GuardInterface {
  can (@Ip() ip: string, @Args() [allowedIp] : [string]) {
    return ip === allowedIp;
  }

  code = 403;
  message = 'Your ip is not allowed';
}
