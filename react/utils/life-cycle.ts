import { EffectCallback, useEffect, useRef } from 'react';

export const useBeforeMount = (callback: () => void) => {
  const mounted = useRef(false);
  if (!mounted.current) callback();
  mounted.current = true;
};

export const useMountEffect = (callback: EffectCallback) => {
  useEffect(callback, []);
};

export const useUnmountEffect = (callback: () => void) => {
  useEffect(() => callback, []);
};
