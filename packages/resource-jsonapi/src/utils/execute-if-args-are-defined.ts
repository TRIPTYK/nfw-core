export function ExecuteIfArgIsDefined<T>(func: (arg: T) => unknown, arg: T | undefined) {
  if (arg !== undefined) {
    func(arg);
  }
}
