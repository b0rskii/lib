import { ExitParams, IntroParams } from './types';

export const getTransitionStringFromParams = (
  transitionParams: IntroParams | ExitParams | undefined,
) => {
  if (!transitionParams) return '';

  const transitions = transitionParams.transitions
    ? transitionParams.transitions
    : Object.keys(transitionParams.to);

  return transitions.map((tr) => `${transitionParams.time}ms ${tr}`).join(', ');
};

export const setStyles = (
  element: HTMLElement,
  properties: string[],
  styles: Partial<CSSStyleDeclaration>,
) => {
  properties.forEach((property) => {
    // @ts-ignore
    element.style[property] = styles[property];
  });
};
