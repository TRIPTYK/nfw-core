import { Args, GuardInterface, Ip } from '../../../../src/index.js';

export class IpGuard implements GuardInterface {
  can (@Ip() ip: string, @Args() [allowedIp] : [string]) {
    return ip === allowedIp;
  }

  code = 403;
  message = 'Your ip is not allowed';
}
