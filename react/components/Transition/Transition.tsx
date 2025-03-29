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
    enterAnimation,
    leaveAnimation,
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
    if (!isShow) return;

    const element = elementRef.current;
    if (!element) return;

    if (enterFrom) {
      const resetTransition = () => {
        element.style.transition = '';
      };

      resetTransition();
      setStyles(element, enterFromProperties, enterFrom);

      const handleTransitionEnd = (evt: TransitionEvent) => {
        if (evt.target !== element) return;
        resetTransition();
      };

      element.addEventListener('transitionend', handleTransitionEnd, {
        once: true,
      });

      requestAnimationFrame(() => {
        element.style.transition = enterTransition || transition;
        setStyles(element, enterToProperties, enterTo);
      });
    }

    if (enterAnimation) {
      element.style.animation = enterAnimation;
    }
  }, [isShow]);

  useLayoutEffect(() => {
    if (isShow) return;

    if (!leaveTo && !leaveAnimation) {
      setMounted(false);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const handleLeaveEnd = (evt: TransitionEvent | AnimationEvent) => {
      if (evt.target !== element) return;
      setMounted(false);
    };

    if (leaveTo) {
      element.addEventListener('transitionend', handleLeaveEnd, {
        once: true,
      });

      element.style.transition = leaveTransition || transition;
      setStyles(element, leaveToProperties, leaveTo);
    }

    if (leaveAnimation) {
      element.addEventListener('animationend', handleLeaveEnd, {
        once: true,
      });
      element.style.animation = `${leaveAnimation} forwards`;
    }

    return () => {
      if (leaveTo) {
        element.removeEventListener('transitionend', handleLeaveEnd);
        element.style.transition = '';
        setStyles(element, leaveToProperties);
        return;
      }
      element.removeEventListener('animationend', handleLeaveEnd);
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
