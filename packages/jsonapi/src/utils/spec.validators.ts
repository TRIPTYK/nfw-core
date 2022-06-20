export function isValidMemberName (str: string): boolean {
  return /^[a-z|A-Z|0-9][a-z|A-Z|0-9|\-|_| ]*[a-z|A-Z|0-9]?$/.test(str);
}
