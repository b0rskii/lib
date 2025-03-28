import { PointerEvent, useCallback, useEffect, useRef } from 'react';
import { externalContentElements } from 'utils/externalContentElements';
import { globalCursor } from 'utils/globalCursor';

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

  const handlePointerMove = useCallback(
    (evt: globalThis.PointerEvent) => {
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

  const handlePointerUp = () => {
    document.removeEventListener('pointermove', handlePointerMove);
    externalContentElements.reset();
    globalCursor.reset();
  };

  const handlePointerDown = (evt: PointerEvent<HTMLDivElement>) => {
    const targetEl = targetRef.current;
    const controlEl = resizeControlRef.current;

    if (!targetEl || !controlEl) return;

    evt.preventDefault();
    evt.stopPropagation();
    document.addEventListener('pointerup', handlePointerUp, { once: true });
    document.addEventListener('pointermove', handlePointerMove);

    // Фиксирование вида курсора на время ресайза
    if (evt.pointerType === 'mouse') globalCursor.set('nw-resize');

    // Блокировка pointer событий на элементах, встраивающих внешний контент, на время ресайза
    externalContentElements.disable();

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

  useEffect(() => {
    return () => {
      externalContentElements.reset();
      globalCursor.reset();
    };
  }, []);

  return {
    resizable: {
      ref: targetRef,
    },
    resizer: {
      ref: resizeControlRef,
      style: { cursor: 'nw-resize' },
      onPointerDown: handlePointerDown,
    },
  };
};
