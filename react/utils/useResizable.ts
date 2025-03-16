import { MouseEvent, RefObject, useCallback, useRef } from 'react';
import { getLimitedValue } from 'utils/numbers';

type UseResizableParams = {
  targetRef: RefObject<HTMLElement>;
  resizeControlRef: RefObject<HTMLElement>;
  minWidth?: number;
  minHeight?: number;
};

export const useResizable = (params: UseResizableParams) => {
  const { targetRef, resizeControlRef, minWidth = 0, minHeight = 0 } = params;

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTargetWidthRef = useRef(0);
  const startTargetHeightRef = useRef(0);
  const startTargetTopRef = useRef(0);
  const startTargetLeftRef = useRef(0);

  const handleMouseMove = useCallback(
    (evt: globalThis.MouseEvent) => {
      const targetEl = targetRef.current;
      const controlEl = resizeControlRef.current;

      if (!targetEl || !controlEl) return;

      const moveX = evt.clientX - startXRef.current;
      const moveY = evt.clientY - startYRef.current;

      const width = startTargetWidthRef.current + moveX;
      const height = startTargetHeightRef.current + moveY;

      const maxWidth = window.innerWidth - startTargetLeftRef.current;
      const maxHeight = window.innerHeight - startTargetTopRef.current;

      targetEl.style.width = `${getLimitedValue(minWidth, width, maxWidth)}px`;
      targetEl.style.height = `${getLimitedValue(minHeight, height, maxHeight)}px`;
    },
    [targetRef, resizeControlRef, minWidth, minHeight],
  );

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const handleMouseDown = (evt: MouseEvent<HTMLDivElement>) => {
    const targetEl = targetRef.current;
    const controlEl = resizeControlRef.current;

    if (!targetEl || !controlEl) return;

    evt.preventDefault();
    evt.stopPropagation();
    document.addEventListener('mouseup', handleMouseUp, { once: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    startXRef.current = evt.clientX;
    startYRef.current = evt.clientY;
    startTargetWidthRef.current = targetEl.clientWidth;
    startTargetHeightRef.current = targetEl.clientHeight;

    const { top, left } = targetEl.getBoundingClientRect();
    startTargetTopRef.current = top;
    startTargetLeftRef.current = left;
  };

  return {
    resizable: {
      style: {
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
      },
    },
    resizeControl: {
      style: { cursor: 'nw-resize' },
      onMouseDown: handleMouseDown,
    },
  };
};
