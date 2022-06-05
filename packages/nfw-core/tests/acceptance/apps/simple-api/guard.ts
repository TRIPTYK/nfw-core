import createHttpError from 'http-errors';
import type { GuardInterface } from '../../../../src/index.js';
import { Args, Header } from '../../../../src/index.js';

export class HeadersGuard implements GuardInterface {
  can (@Header() headers: Record<string, string>, @Args() [header, value, message] : [string, string, string]) {
    if (headers[header] !== value) {
      throw createHttpError(this.code, message ?? this.message);
    }
    return true;
  }

  code = 403;
  message = 'Wrong auth';
}
