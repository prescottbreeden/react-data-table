import { TableColumnProps } from './Table.component';

export const getColStyle = (
  columns: TableColumnProps[],
  col: TableColumnProps
) => {
  const { style, center, width } = col;
  const defaultWidth = 100 / columns.length;

  const getStyleWidth = () => {
    if (style && style.width) {
      return style.width;
    }
    if (width) {
      return width;
    }
    return `${defaultWidth}%`;
  };

  const withWidth = {
    ...style,
    width: getStyleWidth(),
  };

  const withCenter = center
    ? {
        ...withWidth,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }
    : withWidth;

  return withCenter;
};

