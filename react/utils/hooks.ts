import {
  startTransition,
  useEffect,
  useState,
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

export function debounce<T extends (...args: any) => any>(callback: T, delay: number) { 
  let timeout: NodeJS.Timeout | null; 
 
  return function(...args: Parameters<T>) { 
    if (timeout) clearTimeout(timeout); 
 
    setTimeout(() => { 
      timeout = null; 
      callback(...args); 
    }, delay); 
  } 
}

export function throttle(fn, delay, ctx) {
  let lastCall = 0;
  let timeout;
  let lastArgs;

  return function(...args) {
    const now = Date.now();

    if (!lastCall) {
      fn.apply(ctx, args);
      lastCall = now;
      return;
    }

    if (now - lastCall >= delay) {
      fn.apply(ctx, args);
      lastCall = now;
    } else {
      lastArgs = args;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (lastArgs) {
          fn.apply(ctx, lastArgs);
          lastCall = Date.now();
          lastArgs = null;
        }
      }, delay - (now - lastCall));
    }
  };
}
