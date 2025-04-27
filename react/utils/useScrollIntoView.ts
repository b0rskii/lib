import { MutableRefObject, useEffect, useRef } from 'react';

const DEFAULT_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
};

export const useScrollIntoView = <T extends HTMLElement>(
  condition?: boolean,
  options?: ScrollIntoViewOptions,
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (condition === false) return;

    ref.current?.scrollIntoView(options ?? DEFAULT_OPTIONS);
  }, [condition]);

  return ref;
};

export const useScrollToElements = <T extends HTMLElement>(
  conditions: boolean[],
  options?: ScrollIntoViewOptions,
) => {
  const enabled = useRef(true);
  enabled.current = true;

  const refs: MutableRefObject<T | null>[] = [];

  for (const condition of conditions) {
    const ref = useRef<T | null>(null);
    refs.push(ref);

    useEffect(() => {
      if (!condition || !enabled.current) return;

      enabled.current = false;

      ref.current?.scrollIntoView(options ?? DEFAULT_OPTIONS);
    }, [condition]);
  }

  return refs;
};
