export const getNumberFromValueWithUnits = (value: string) => {
  return Number(value.replace(/[^\d.-]/g, ''));
};
