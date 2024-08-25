export const has = <T>(object: T, key: keyof T) => {
  return Object.keys(object).includes(key as string) && object[key] !== undefined;
};
