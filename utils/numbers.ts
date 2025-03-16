export const getLimitedValue = (min: number, value: number, max: number) => {
  if (value < min) return min;
  return Math.min(value, max);
};
