export function functionSignature (functionName: string, ...args: unknown[]) {
  return functionName + args.map((arg) => arg).join('');
}
