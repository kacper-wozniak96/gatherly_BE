export const has = <T>(object: T, key: keyof T) => {
  return Object.keys(object).includes(String(key) as string) && object[key] !== undefined;
};
