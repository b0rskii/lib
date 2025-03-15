import { useRef } from 'react';
import {
  decimalSeparatorToDot,
  decimalSeparatorToComma,
  roundNumber,
} from 'utils/formatters';

const getDisplayedValue = (value: string, isCommaDecimalSeparator: boolean) =>
  isCommaDecimalSeparator ? decimalSeparatorToComma(value) : value;

type UseDisplayedValueProps = {
  value: string;
  minValue: number;
  maxValue: number;
  isCommaDecimalSeparator: boolean;
  decimalScale?: number;
};

export const useDisplayedValue = ({
  value,
  minValue,
  maxValue,
  isCommaDecimalSeparator,
  decimalScale,
}: UseDisplayedValueProps) => {
  const isInitialRenderRef = useRef(true);

  if (isInitialRenderRef.current) {
    isInitialRenderRef.current = false;

    const numValue = Number(decimalSeparatorToDot(value));

    if (numValue < minValue) {
      return getDisplayedValue(minValue.toString(), isCommaDecimalSeparator);
    }

    if (numValue > maxValue) {
      return getDisplayedValue(maxValue.toString(), isCommaDecimalSeparator);
    }

    return getDisplayedValue(
      roundNumber(numValue, decimalScale).toString(),
      isCommaDecimalSeparator,
    );
  }

  return getDisplayedValue(value, isCommaDecimalSeparator);
};

type GetFormattedValueOnChangeProps = {
  newValue: string;
  currentValue: string;
  minValue: number;
  maxValue: number;
  decimalScale?: number;
};

export const getFormattedValueOnChange = ({
  newValue,
  currentValue,
  minValue,
  maxValue,
  decimalScale,
}: GetFormattedValueOnChangeProps) => {
  const newNumValue = Number(decimalSeparatorToDot(newValue));
  const allowNegative = minValue < 0;

  // Если новое значение не число и не минус, оставляем текущее значение без изменений.
  // Если новое значение минус и отрицательные числа допустимы, возвращаем минус.
  if (Number.isNaN(newNumValue)) {
    return newValue === '-' && allowNegative
      ? '-'
      : decimalSeparatorToDot(currentValue);
  }

  // Если отрицательные значения недопустимы, блокируем их ввод.
  if (newNumValue < 0 && !allowNegative) {
    return decimalSeparatorToDot(currentValue);
  }

  // Автоматическая подстановка запятой при вводе X, если минимальное значение X,(...)
  if (!Number.isInteger(minValue)) {
    const integerStrMinValue = Math.trunc(minValue).toString();
    const integerStrMinValueWithSeparator = `${integerStrMinValue}.`;

    if (
      newValue === integerStrMinValue &&
      currentValue !== integerStrMinValueWithSeparator
    ) {
      return integerStrMinValueWithSeparator;
    }
  }

  if (newNumValue >= maxValue) {
    return maxValue.toString();
  }

  if (decimalScale !== undefined) {
    const newValueWithDotSeparator = decimalSeparatorToDot(newValue);

    if (newValueWithDotSeparator.includes('.')) {
      const [integer, decimal] = newValueWithDotSeparator.split('.');
      return `${integer}.${decimal.slice(0, decimalScale)}`;
    }
  }

  return decimalSeparatorToDot(newValue);
};

type GetFormattedValueOnBlurProps = {
  currentValue: string;
  minValue: number;
  maxValue: number;
  decimalScale?: number;
};

export const getFormattedValueOnBlur = ({
  currentValue,
  minValue,
  maxValue,
  decimalScale,
}: GetFormattedValueOnBlurProps) => {
  if (currentValue === '-' || currentValue === '') {
    return '';
  }

  const currentNumValue = Number(decimalSeparatorToDot(currentValue));

  if (currentNumValue <= minValue) {
    return minValue.toString();
  }

  if (currentNumValue >= maxValue) {
    return maxValue.toString();
  }

  const formatedValue = roundNumber(currentNumValue, decimalScale).toString();
  return decimalSeparatorToDot(formatedValue);
};
