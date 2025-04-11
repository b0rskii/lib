import {
  PointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { getLimitedValue } from 'utils/numbers';
import { getAdjustedInitialCoords } from 'utils/elementsPositioning';
import { PositionX, PositionY } from 'types/common';
import { globalStyles } from 'utils/globalStyles';

export type UseDraggableModalParams = {
  anchorRef?: RefObject<HTMLElement>;
  positionX?: PositionX;
  positionY?: PositionY;
  offset?: number;
  isOpen?: boolean;
};

export const useDraggableModal = <Modal extends HTMLElement>(
  params: UseDraggableModalParams,
) => {
  const { anchorRef, positionX, positionY, offset = 0, isOpen } = params;

  const modalRef = useRef<Modal | null>(null);

  // Координаты мыши на момент начала перемещения
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  // Координаты модалки на момент начала перемещения
  const startModalTopRef = useRef(0);
  const startModalLeftRef = useRef(0);

  // Размеры модалки на момент начала перемещения
  const modalWidthRef = useRef(0);
  const modalHeightRef = useRef(0);

  // Начальные размеры модалки
  const initialModalWidthRef = useRef(0);
  const initialModalHeightRef = useRef(0);

  const handlePointerMove = useCallback(
    (evt: globalThis.PointerEvent) => {
      const modal = modalRef.current;
      if (!modal) return;

      // Длина перемещения курсора
      const dragX = evt.clientX - startXRef.current;
      const dragY = evt.clientY - startYRef.current;

      // Новые координаты модалки с учетом длины перемещения курсора
      const top = startModalTopRef.current + dragY;
      const left = startModalLeftRef.current + dragX;

      // Верхние пределы координат модалки для сохранения ее расположения в границах окна браузера
      const maxTop = window.innerHeight - modalHeightRef.current;
      const maxLeft = window.innerWidth - modalWidthRef.current;

      modal.style.top = `${getLimitedValue(0, top, maxTop)}px`;
      modal.style.left = `${getLimitedValue(0, left, maxLeft)}px`;
    },
    [],
  );

  const handlePointerUp = () => {
    document.removeEventListener('pointermove', handlePointerMove);
    globalStyles.reset();
  };

  const handlePointerDown = (evt: PointerEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (!modal) return;

    evt.preventDefault();
    evt.stopPropagation();
    document.addEventListener('pointerup', handlePointerUp, { once: true });
    document.addEventListener('pointermove', handlePointerMove);

    // Фиксирование вида курсора на время перемещения
    if (evt.pointerType === 'mouse') {
      globalStyles.setCursor('grabbing');
    }
    // Блокировка pointer событий на элементах, встраивающих внешний контент, на время перемещения
    globalStyles.disableExternalContentElements();

    // Вывод текущей модалки на передний план
    if (modal.nextElementSibling) {
      modal.parentElement?.append(modal);
    }

    // Установка координат мыши на момент начала перемещения
    startXRef.current = evt.clientX;
    startYRef.current = evt.clientY;

    // Установка координат модалки на момент начала перемещения
    const { top, left } = modal.getBoundingClientRect();
    startModalTopRef.current = top;
    startModalLeftRef.current = left;

    // Установка размеров модалки на момент начала перемещения
    modalWidthRef.current = modal.offsetWidth;
    modalHeightRef.current = modal.offsetHeight;
  };

  // Установка координат модалки при ее появлении
  const setModalCoords = (modal: Modal) => {
    const modalWidth = initialModalWidthRef.current;
    const modalHeight = initialModalHeightRef.current;

    let initialTop = 0;
    let initialLeft = 0;

    const anchorEl = anchorRef?.current;

    // Размещение модалки относительно переданного элемента-якоря
    if (anchorEl) {
      const { top, left } = getAdjustedInitialCoords({
        anchorEl,
        targetEl: modal,
        positionX,
        positionY,
        offset,
      });
      initialTop = Math.max(top, 0);
      initialLeft = Math.max(left, 0);
    } else {
      // По умолчанию размещение модалки по центру экрана
      const centerTop = window.innerHeight / 2 - modalHeight / 2;
      const centerLeft = window.innerWidth / 2 - modalWidth / 2;
      initialTop = Math.max(centerTop, 0);
      initialLeft = Math.max(centerLeft, 0);
    }

    modal.style.top = `${initialTop}px`;
    modal.style.left = `${initialLeft}px`;

    // Верхние пределы размеров модалки для сохранения ее расположения в границах окна браузера
    const maxWidth = window.innerWidth - initialLeft;
    const maxHeight = window.innerHeight - initialTop;

    modal.style.width = `${Math.min(modalWidth, maxWidth)}px`;
    modal.style.height = `${Math.min(modalHeight, maxHeight)}px`;
  };

  // Начальные установки при монтировании
  useLayoutEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.style.position = 'fixed';
    modal.style.cursor = 'grab';
    modal.style.touchAction = 'none';

    // Сохранение начальных размеров, для их восстановления, если требуется постоянное наличие модалки в DOM
    initialModalWidthRef.current = modal.offsetWidth;
    initialModalHeightRef.current = modal.offsetHeight;

    setModalCoords(modal);
  }, []);

  // Если модалка должна всегда находиться в DOM
  useLayoutEffect(() => {
    if (isOpen === true) {
      const modal = modalRef.current;
      if (!modal) return;

      // Сброс размеров до начальных
      modal.style.width = `${initialModalWidthRef.current}px`;
      modal.style.height = `${initialModalHeightRef.current}px`;

      setModalCoords(modal);

      // Вывод текущей модалки на передний план
      if (modal.nextElementSibling) {
        modal.parentElement?.append(modal);
      }
    }
  }, [isOpen]);

  // Сохранение модалки в границах экрана при изменении размеров окна браузера
  useEffect(() => {
    if (isOpen === false) return;

    const handleResize = () => {
      const modal = modalRef.current;
      if (!modal) return;

      const { top, left } = modal.getBoundingClientRect();

      // Верхние пределы координат модалки
      const maxTop = window.innerHeight - modal.offsetHeight;
      const maxLeft = window.innerWidth - modal.offsetWidth;

      modal.style.top = `${getLimitedValue(0, top, maxTop)}px`;
      modal.style.left = `${getLimitedValue(0, left, maxLeft)}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      globalStyles.reset();
    };
  }, [isOpen]);

  return {
    ref: modalRef,
    onPointerDown: handlePointerDown,
  };
};
