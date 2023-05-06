export function arrayWithElementsOrUndefined(included: Map<any, any>) {
    return included.size > 0 ? Array.from(included.values()) : undefined;
  }
