export function functionSignature (functionName: string, ...args: unknown[]) {
  return functionName + '_' + args.map((arg) => arg).join('');
}
