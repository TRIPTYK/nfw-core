import { Args, GuardInterface, Header } from '../../../../src/index.js';

export class AgentGuard implements GuardInterface {
  can (@Header() headers: Record<string, string>, @Args() [allowedAgent] : [string]) {
    return headers.authorization === allowedAgent;
  }

  code = 403;
  message = 'Wrong auth';
}
