import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { TransitionComponentProps, TransitionProps } from './types';
import { getTransitionStringFromParams, setStyles } from './utils';

const TransitionComponent = (props: TransitionComponentProps) => {
  const { isShow, intro, exit, children, setMounted } = props;

  const [isInitial, setIsInitial] = useState(true);

  const helperElementRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>();

  const introFromProperties = useMemo(
    () => (intro ? Object.keys(intro.from) : []),
    [],
  );
  const introToProperties = useMemo(
    () => (intro ? Object.keys(intro.to) : []),
    [],
  );
  const introTransition = useMemo(
    () => getTransitionStringFromParams(intro),
    [],
  );

  const exitToProperties = useMemo(
    () => (exit ? Object.keys(exit.to) : []),
    [],
  );
  const exitTransition = useMemo(() => getTransitionStringFromParams(exit), []);

  useLayoutEffect(() => {
    if (isInitial) {
      const helperElement = helperElementRef.current;
      elementRef.current = helperElement?.nextSibling as HTMLElement | null;
      setIsInitial(false);
    }

    if (!intro || !isShow) return;

    const element = elementRef.current;
    if (!element) return;

    element.style.transition = '';
    setStyles(element, introFromProperties, intro.from);

    requestAnimationFrame(() => {
      element.style.transition = introTransition;
      setStyles(element, introToProperties, intro.to);
    });
  }, [isShow]);

  useLayoutEffect(() => {
    if (!exit || isShow) return;

    const element = elementRef.current;
    if (!element) return;

    const timeout = setTimeout(() => {
      setMounted(false);
    }, exit.time);

    element.style.transition = exitTransition;
    setStyles(element, exitToProperties, exit.to);

    return () => {
      clearTimeout(timeout);
    };
  }, [isShow]);

  return (
    <>
      {isInitial && <div ref={helperElementRef} />}
      {children}
    </>
  );
};

export const Transition = (props: TransitionProps) => {
  const { isShow = true, ...otherProps } = props;
  const [mounted, setMounted] = useState(isShow);

  useLayoutEffect(() => {
    if (isShow) setMounted(true);
  }, [isShow]);

  if (!mounted) return null;

  return (
    <TransitionComponent
      isShow={isShow}
      setMounted={setMounted}
      {...otherProps}
    />
  );
};
