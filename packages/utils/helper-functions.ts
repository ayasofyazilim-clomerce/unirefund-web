export function removeEmptyObjects<T>(obj: T): T {
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map(removeEmptyObjects).filter((item) => {
        if (typeof item === "object") {
          return Object.keys(item).length > 0;
        }
        return true;
      }) as T;
    }
    return Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, removeEmptyObjects(value)])
        .filter(([_, value]) => {
          if (typeof value === "object") {
            return Object.keys(value).length > 0;
          }
          return value !== undefined && value !== null;
        }),
    );
  }
  return obj;
}
