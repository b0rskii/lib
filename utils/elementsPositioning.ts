type PositionX = 'left' | 'rigth';
type PositionY = 'top' | 'bottom';

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
    positionX = 'rigth',
  } = params;

  const { top, bottom, left, right } = anchorEl.getBoundingClientRect();

  const yTop = top - targetEl.clientHeight - offset;
  const yBottom = bottom + offset;
  const xLeft = left - targetEl.clientWidth - offset;
  const xRight = right + offset;

  // Позиция bottom-right по умолчанию
  let resultTop = yBottom;
  let resultLeft = xRight;

  // Установка заданного позиционирования
  if (positionY === 'top') resultTop = yTop;
  if (positionX === 'left') resultLeft = xLeft;

  // Корректировка позиционирования относительно границ окна
  if (resultTop < 0) resultTop = yBottom;
  if (resultTop + targetEl.clientHeight > window.innerHeight) resultTop = yTop;
  if (resultLeft < 0) resultLeft = xRight;
  if (resultLeft + targetEl.clientWidth > window.innerWidth) resultLeft = xLeft;

  return {
    top: resultTop,
    left: resultLeft,
  };
};
