import {
  startTransition,
  useEffect,
  useState,
  useRef,
  RefObject,
} from "react";

export function useAppearanceDelay(
  show?: boolean,
  options = {} as {
    defaultValue?: boolean;
    appearenceDelay?: number;
    minDisplay?: number;
  },
) {
  const {
    minDisplay = 500,
    defaultValue = false,
    appearenceDelay = 500,
  } = options;

  const [delayedShow, setDelayedShow] = useState(defaultValue);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        startTransition(() => setDelayedShow(true));
      }, appearenceDelay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        startTransition(() => setDelayedShow(false));
      }, minDisplay);
      return () => clearTimeout(timer);
    }
  }, [appearenceDelay, show, minDisplay]);

  return delayedShow;
}

export const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const timerId = useRef<NodeJS.Timeout>();

  useEffect(
    () => () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    },
    []
  );

  if (timerId.current) {
    clearTimeout(timerId.current);
  }

  timerId.current = setTimeout(() => {
    setDebouncedValue(value);
  }, delayMs);

  return debouncedValue;
};

export const useScrollIntoView = (
  elementRef: RefObject<HTMLElement>,
  condition: boolean,
) => {
  useEffect(() => {
    if (!condition) return;

    elementRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [elementRef, condition]);
};

export const useScrollToElements = (
  data: { elementRef: RefObject<HTMLElement>; condition: boolean }[],
) => {
  const enabled = useRef(true);
  enabled.current = true;

  for (const { elementRef, condition } of data) {
    useEffect(() => {
      if (!condition || !enabled.current) return;

      enabled.current = false;

      elementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, [elementRef, condition]);
  }
};
