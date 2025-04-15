export const getLimitedValue = (min: number, value: number, max: number) => {
  return Math.max(Math.min(value, max), min);
};
