import { MutableRefObject, useCallback } from 'react';

export const useCallbackRef = <Element extends HTMLElement>(
  ...refs: MutableRefObject<Element | null>[]
) => {
  return useCallback(
    (element: Element | null) => {
      refs.forEach((ref) => {
        ref.current = element;
      });
    },
    [...refs],
  );
};
