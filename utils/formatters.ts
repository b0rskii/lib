export const decimalSeparatorToDot = (value: string) => value.replace(',', '.');
export const decimalSeparatorToComma = (value: string) =>
  value.replace('.', ',');

export const roundNumber = (number: number, digits?: number) => {
  if (digits === undefined) return number;

  const multiple = 10 ** digits;
  const roundedNum = Math.round(number * multiple) / multiple;

  return roundedNum;
};
