import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { TransitionComponentProps, TransitionProps } from './types';
import { setStyles } from './utils';

const TransitionComponent = (props: TransitionComponentProps) => {
  const {
    isShow,
    enterFrom,
    enterTo,
    enterTransition = '',
    leaveTo,
    leaveTransition = '',
    children,
    setMounted,
  } = props;

  const [isInitial, setIsInitial] = useState(true);

  const helperElementRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>();

  const enterFromProperties = useMemo(
    () => (enterFrom ? Object.keys(enterFrom) : []),
    [],
  );
  const enterToProperties = useMemo(
    () => (enterTo ? Object.keys(enterTo) : enterFromProperties),
    [],
  );

  const leaveToProperties = useMemo(
    () => (leaveTo ? Object.keys(leaveTo) : []),
    [],
  );

  useLayoutEffect(() => {
    if (isInitial) {
      const helperElement = helperElementRef.current;
      elementRef.current = helperElement?.nextSibling as HTMLElement | null;
      setIsInitial(false);
    }

    if (!enterFrom || !isShow) return;

    const element = elementRef.current;
    if (!element) return;

    const resetTransition = () => {
      element.style.transition = '';
    };

    resetTransition();
    setStyles(element, enterFromProperties, enterFrom);

    element.addEventListener('transitionend', resetTransition, { once: true });

    requestAnimationFrame(() => {
      element.style.transition = enterTransition;
      setStyles(element, enterToProperties, enterTo);
    });
  }, [isShow]);

  useLayoutEffect(() => {
    if (!leaveTo || isShow) return;

    const element = elementRef.current;
    if (!element) return;

    const unmount = () => setMounted(false);
    element.addEventListener('transitionend', unmount, { once: true });

    element.style.transition = leaveTransition;
    setStyles(element, leaveToProperties, leaveTo);

    return () => {
      element.removeEventListener('transitionend', unmount);
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
