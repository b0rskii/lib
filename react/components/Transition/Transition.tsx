import { ReactElement, useLayoutEffect, useRef, useState } from 'react';

type TransitionParams = {
  from: Partial<CSSStyleDeclaration>;
  to: Partial<CSSStyleDeclaration>;
  time: number;
};

type TransitionComponentProps = {
  isShow?: boolean;
  intro?: TransitionParams;
  exit?: Omit<TransitionParams, 'from'>;
  children: ReactElement;
  setMounted: (value: boolean) => void;
};

const TransitionComponent = (props: TransitionComponentProps) => {
  const { isShow, intro, exit, children, setMounted } = props;

  const [isInitial, setIsInitial] = useState(true);

  const helperElementRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>();

  useLayoutEffect(() => {
    if (isShow) {
      setIsInitial(false);

      if (isInitial) {
        const helperElement = helperElementRef.current;
        elementRef.current = helperElement?.nextSibling as HTMLElement | null;
      }

      const element = elementRef.current;
      if (!element) return;

      if (intro) {
        element.style.transition = '';

        const transitions = Object.keys(intro.to);

        transitions.forEach((property) => {
          // @ts-ignore
          element.style[property] = intro.from[property];
        });

        requestAnimationFrame(() => {
          const transition = transitions
            .map((tr) => `${tr} ${intro.time}ms`)
            .join(', ');

          element.style.transition = transition;

          transitions.forEach((property) => {
            // @ts-ignore
            element.style[property] = intro.to[property];
          });
        });
      }
    }
  }, [isShow]);

  useLayoutEffect(() => {
    if (!exit || isShow) return;

    const element = elementRef.current;
    if (!element) return;

    const timeout = setTimeout(() => {
      setMounted(false);
    }, exit.time);

    const transitions = Object.keys(exit.to);

    const transition = transitions
      .map((tr) => `${tr} ${exit.time}ms`)
      .join(', ');

    element.style.transition = transition;

    transitions.forEach((property) => {
      // @ts-ignore
      element.style[property] = exit.to[property];
    });

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

type TransitionProps = Omit<TransitionComponentProps, 'setMounted'>;

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
