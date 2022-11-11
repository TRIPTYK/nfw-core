import type { GuardInterface } from '@triptyk/nfw-http';
import { QueryParam } from '@triptyk/nfw-http';

export class AuthGuard implements GuardInterface {
  public can (@QueryParam('user') user: string): boolean | Promise<boolean> {
    if (user === 'admin') {
      return true;
    }
    return false;
  }
}
