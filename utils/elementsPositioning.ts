import { PositionX, PositionY } from "types/common";

type GetAdjustedInitialCoords = (params: {
  anchorEl: HTMLElement;
  targetEl: HTMLElement;
  offset: number;
  positionX?: PositionX;
  positionY?: PositionY;
}) => { top: number; left: number };

export const getAdjustedInitialCoords: GetAdjustedInitialCoords = (params) => {
  const {
    anchorEl,
    targetEl,
    offset,
    positionY = 'bottom',
    positionX = 'right',
  } = params;

  const { top, bottom, left, right } = anchorEl.getBoundingClientRect();

  const yTop = top - targetEl.offsetHeight - offset;
  const yBottom = bottom + offset;
  const xLeft = left - targetEl.offsetWidth - offset;
  const xRight = right + offset;

  // Позиция bottom-right по умолчанию
  let resultTop = yBottom;
  let resultLeft = xRight;

  // Установка заданного позиционирования
  if (positionY === 'top') resultTop = yTop;
  if (positionX === 'left') resultLeft = xLeft;

  // Корректировка позиционирования относительно границ окна
  if (resultTop < 0) resultTop = yBottom;
  if (resultTop + targetEl.offsetHeight > window.innerHeight) resultTop = yTop;
  if (resultLeft < 0) resultLeft = xRight;
  if (resultLeft + targetEl.offsetWidth > window.innerWidth) resultLeft = xLeft;

  return {
    top: resultTop,
    left: resultLeft,
  };
};
