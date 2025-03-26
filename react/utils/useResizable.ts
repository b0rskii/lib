import { MouseEvent, useCallback, useRef } from 'react';

export const useResizable = <
  Target extends HTMLElement,
  Resizer extends HTMLElement,
>() => {
  const targetRef = useRef<Target | null>(null);
  const resizeControlRef = useRef<Resizer | null>(null);

  // Координаты мыши на момент начала ресайза
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  // Координаты элемента на момент начала ресайза
  const startTargetTopRef = useRef(0);
  const startTargetLeftRef = useRef(0);

  // Размеры элемента на момент начала ресайза
  const startTargetWidthRef = useRef(0);
  const startTargetHeightRef = useRef(0);

  const handleMouseMove = useCallback(
    (evt: globalThis.MouseEvent) => {
      const targetEl = targetRef.current;
      const controlEl = resizeControlRef.current;

      if (!targetEl || !controlEl) return;

      // Длина перемещения курсора
      const moveX = evt.clientX - startXRef.current;
      const moveY = evt.clientY - startYRef.current;

      // Новые размеры элемента с учетом длины перемещения курсора
      const width = startTargetWidthRef.current + moveX;
      const height = startTargetHeightRef.current + moveY;

      // Верхние пределы размеров элемента для сохранения его расположения в границах окна браузера
      const maxWidth = window.innerWidth - startTargetLeftRef.current;
      const maxHeight = window.innerHeight - startTargetTopRef.current;

      targetEl.style.width = `${Math.min(width, maxWidth)}px`;
      targetEl.style.height = `${Math.min(height, maxHeight)}px`;
    },
    [],
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

    // Установка координат мыши на момент начала ресайза
    startXRef.current = evt.clientX;
    startYRef.current = evt.clientY;

    // Установка координат элемента на момент начала ресайза
    const { top, left } = targetEl.getBoundingClientRect();
    startTargetTopRef.current = top;
    startTargetLeftRef.current = left;

    // Установка размеров элемента на момент начала ресайза
    startTargetWidthRef.current = targetEl.offsetWidth;
    startTargetHeightRef.current = targetEl.offsetHeight;
  };

  return {
    resizable: {
      ref: targetRef,
    },
    resizer: {
      ref: resizeControlRef,
      style: { cursor: 'nw-resize' },
      onMouseDown: handleMouseDown,
    },
  };
};
