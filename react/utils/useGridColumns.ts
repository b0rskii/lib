import { RefObject, useLayoutEffect, useState } from 'react';

type Params = {
  gridContainerRef: RefObject<HTMLElement>;
  itemMinWidth: number;
  maxColCount: number;
  gap: number;
};

export const useGridColumns = ({
  gridContainerRef,
  itemMinWidth,
  maxColCount,
  gap,
}: Params) => {
  const [columns, setColumns] = useState(maxColCount);

  useLayoutEffect(() => {
    const grid = gridContainerRef.current;
    if (!grid) return;

    const observer = new ResizeObserver(() => {
      // ширина контейнера
      const wrapperWidth = grid.clientWidth;
      // количество влезающих элементов с минимальной шириной без учета гэпа
      const cleanItemsCount = Math.floor(wrapperWidth / itemMinWidth);
      // количество влезающих элементов с минимальной шириной с учетом гэпа
      const itemsCountWithGap =
        (wrapperWidth - gap * (cleanItemsCount - 1)) / itemMinWidth;
      // финальное количество колонок
      const columnsCount = Math.min(Math.floor(itemsCountWithGap), maxColCount);

      grid.style.setProperty('--columns-count', columnsCount.toString());
      setColumns(columnsCount);
    });

    observer.observe(grid);

    return () => {
      observer.disconnect();
    };
  }, [gridContainerRef, itemMinWidth, maxColCount, gap]);

  return { columns };
};
