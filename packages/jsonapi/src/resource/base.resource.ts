
export type ResourceContext = Record<string, unknown>;

type Methods<T> = { [P in keyof T as T[P] extends Function ? never : P]?: T[P] };

export type Resource<T extends unknown> = Methods<T>;
