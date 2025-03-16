import {
  MouseEvent,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { getAdjustedInitialCoords } from 'utils/elementsPositioning';
import { getLimitedValue } from 'utils/numbers';

const DRAGGABLE_DATA_ATTR = 'data-draggable-modal';
const DEFAULT_OFFSET = 16;

type PositionX = 'left' | 'rigth';
type PositionY = 'top' | 'bottom';

export type UseDraggableModalParams = {
  modalRef: RefObject<HTMLElement>;
  anchorRef?: RefObject<HTMLElement>;
  positionX?: PositionX;
  positionY?: PositionY;
  offset?: number;
};

export const useDraggableModal = (params: UseDraggableModalParams) => {
  const {
    modalRef,
    anchorRef,
    positionX,
    positionY,
    offset = DEFAULT_OFFSET,
  } = params;

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startElTopRef = useRef(0);
  const startElLeftRef = useRef(0);

  const handleMouseMove = useCallback(
    (evt: globalThis.MouseEvent) => {
      const draggableEl = modalRef.current;
      if (!draggableEl) return;

      const dragX = evt.clientX - startXRef.current;
      const dragY = evt.clientY - startYRef.current;

      const top = startElTopRef.current + dragY;
      const left = startElLeftRef.current + dragX;

      const maxTop = window.innerHeight - draggableEl.clientHeight - 2;
      const maxLeft = window.innerWidth - draggableEl.clientWidth - 2;

      draggableEl.style.top = `${getLimitedValue(0, top, maxTop)}px`;
      draggableEl.style.left = `${getLimitedValue(0, left, maxLeft)}px`;
    },
    [modalRef],
  );

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);

    const draggableEl = modalRef.current;
    if (!draggableEl) return;

    draggableEl.style.cursor = 'grab';
  };

  const handleMouseDown = (evt: MouseEvent<HTMLDivElement>) => {
    const draggableEl = modalRef.current;
    if (!draggableEl) return;

    evt.preventDefault();
    document.addEventListener('mouseup', handleMouseUp, { once: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    draggableEl.style.cursor = 'grabbing';

    const dragEls = document.querySelectorAll<HTMLDivElement>(
      `[${DRAGGABLE_DATA_ATTR}]`,
    );

    if (dragEls.length > 1) {
      let maxZIndex = 0;

      dragEls.forEach((el) => {
        const { zIndex } = el.style;
        maxZIndex = Math.max(maxZIndex, Number(zIndex));
      });

      draggableEl.style.zIndex = `${maxZIndex + 1}`;
    }

    startXRef.current = evt.clientX;
    startYRef.current = evt.clientY;

    const { top, left } = draggableEl.getBoundingClientRect();
    startElTopRef.current = top;
    startElLeftRef.current = left;
  };

  useLayoutEffect(() => {
    const draggableEl = modalRef.current;
    if (!draggableEl) return;

    draggableEl.style.position = 'fixed';
    draggableEl.style.cursor = 'grab';

    const anchorEl = anchorRef?.current;

    if (anchorEl) {
      const { top, left } = getAdjustedInitialCoords({
        anchorEl,
        targetEl: draggableEl,
        positionX,
        positionY,
        offset,
      });
      draggableEl.style.top = `${top}px`;
      draggableEl.style.left = `${left}px`;
      return;
    }

    draggableEl.style.top = `${window.innerHeight / 2 - draggableEl.clientHeight / 2}px`;
    draggableEl.style.left = `${window.innerWidth / 2 - draggableEl.clientWidth / 2}px`;
  }, [modalRef, anchorRef, positionX, positionY, offset]);

  return {
    [DRAGGABLE_DATA_ATTR]: '',
    onMouseDown: handleMouseDown,
  };
};
