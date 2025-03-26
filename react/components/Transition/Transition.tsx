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
    transition = '',
    children,
    setMounted,
  } = props;

  const [isInitial, setIsInitial] = useState(true);

  const helperElementRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);

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
    const helperElement = helperElementRef.current;
    elementRef.current = helperElement?.nextSibling as HTMLElement | null;
    setIsInitial(false);
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
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
      element.style.transition = enterTransition || transition;
      setStyles(element, enterToProperties, enterTo);
    });
  }, [isShow]);

  useLayoutEffect(() => {
    if (isShow) return;

    const unmount = () => setMounted(false);

    if (!leaveTo) {
      unmount();
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('transitionend', unmount, { once: true });

    element.style.transition = leaveTransition || transition;
    setStyles(element, leaveToProperties, leaveTo);

    return () => {
      if (!leaveTo) return;

      element.removeEventListener('transitionend', unmount);
      element.style.transition = '';
      setStyles(element, leaveToProperties);
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

  if (!isShow && !mounted) return null;

  return (
    <TransitionComponent
      isShow={isShow}
      setMounted={setMounted}
      {...otherProps}
    />
  );
};
