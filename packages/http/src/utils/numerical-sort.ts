export function numericalSortOnKeyASC<O extends Record<string, any>> (array : O[], propertyName: keyof O) {
  return [...array].sort((a, b) => a[propertyName] - b[propertyName]);
}
