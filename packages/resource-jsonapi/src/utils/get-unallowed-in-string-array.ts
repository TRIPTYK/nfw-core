export function getUnallowedInStringArray(uncheckedArray: string[], allowedValues: string[]) {
  return uncheckedArray.filter(value => allowedValues.includes(value));
}
