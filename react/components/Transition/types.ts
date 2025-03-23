import { ReactElement } from 'react';

export type IntroParams = {
  from: Partial<CSSStyleDeclaration>;
  to: Partial<CSSStyleDeclaration>;
  time: number;
  transitions?: string[];
};

export type ExitParams = Omit<IntroParams, 'from'>;

export type TransitionComponentProps = {
  isShow?: boolean;
  intro?: IntroParams;
  exit?: ExitParams;
  children: ReactElement;
  setMounted: (value: boolean) => void;
};

export type TransitionProps = Omit<TransitionComponentProps, 'setMounted'>;
