import { MutableRefObject, useEffect, useMemo, useRef } from 'react';

export const useScrollIntoView = <T extends HTMLElement>(
  condition: boolean,
  options?: ScrollIntoViewOptions,
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!condition) return;

    ref.current?.scrollIntoView(
      options ?? {
        behavior: 'smooth',
        block: 'center',
      },
    );
  }, [condition, options]);

  return ref;
};

export const useScrollToElements = <T extends HTMLElement>(
  conditions: boolean[],
  options?: ScrollIntoViewOptions,
) => {
  const enabled = useRef(true);
  enabled.current = true;

  const optionsValue: ScrollIntoViewOptions = useMemo(
    () =>
      options ?? {
        behavior: 'smooth',
        block: 'center',
      },
    [options],
  );

  const refs: MutableRefObject<T | null>[] = [];

  for (const condition of conditions) {
    const ref = useRef<T | null>(null);
    refs.push(ref);

    useEffect(() => {
      if (!condition || !enabled.current) return;

      enabled.current = false;

      ref.current?.scrollIntoView(optionsValue);
    }, [condition, optionsValue]);
  }

  return refs;
};
