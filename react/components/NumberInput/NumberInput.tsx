import { ChangeEvent } from 'react';
import {
  useDisplayedValue,
  getFormattedValueOnChange,
  getFormattedValueOnBlur,
} from './model';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  decimalScale?: number;
  isCommaDecimalSeparator?: boolean;
  minValue?: number;
  maxValue?: number;
};

export const NumberInput = ({
  value,
  onChange,
  onBlur,
  decimalScale,
  isCommaDecimalSeparator = true,
  minValue = Number.MIN_SAFE_INTEGER,
  maxValue = Number.MAX_SAFE_INTEGER,
}: Props) => {
  const displayedValue = useDisplayedValue({
    value,
    minValue,
    maxValue,
    decimalScale,
    isCommaDecimalSeparator,
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const formatedValue = getFormattedValueOnChange({
      newValue: evt.target.value,
      currentValue: value,
      minValue,
      maxValue,
      decimalScale,
    });
    onChange(formatedValue);
  };

  const handleBlur = () => {
    const formatedValue = getFormattedValueOnBlur({
      currentValue: value,
      minValue,
      maxValue,
      decimalScale,
    });
    onChange(formatedValue);
    onBlur?.(formatedValue);
  };

  return (
    <input value={displayedValue} onChange={handleChange} onBlur={handleBlur} />
  );
};
