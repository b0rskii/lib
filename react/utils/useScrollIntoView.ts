import { MutableRefObject, useEffect, useRef, useState } from 'react';

type Condition = boolean | string | null | undefined;

const DEFAULT_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
};

export const useScrollIntoView = <T extends HTMLElement>(
  conditions: Condition[],
  options?: ScrollIntoViewOptions,
) => {
  const [trigger, setTrigger] = useState<{}>();
  const refs: MutableRefObject<T | null>[] = [];

  for (let i = 0; i < conditions.length; i++) {
    const ref = useRef<T | null>(null);
    refs.push(ref);
  }

  useEffect(() => {
    if (!trigger) return;

    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i]) {
        refs[i].current?.scrollIntoView(options ?? DEFAULT_OPTIONS);
        break;
      }
    }
  }, [trigger]);

  const triggerScroll = () => {
    setTrigger({});
  };

  return { refs, triggerScroll };
};
