import { Args, GuardInterface, Ip } from '@triptyk/nfw-core';

export class Guard implements GuardInterface {
  can (@Ip() ip: string, @Args() [allowedIp] : [string]) {
    return ip === allowedIp;
  }

  code?: number | undefined;
  message?: string | undefined;
}
