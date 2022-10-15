import React from 'react';
import { map } from 'lodash';
import { mergeObjects, prop, randomString } from '../util/objectUtility';
import {
  TableComponentProps,
  RowContainer,
  TableColumnProps,
} from './Table.component';
import { getColStyle } from './tableHelpers';
import { Icon } from './Icon';

interface RowProps extends TableComponentProps {
  expandDict: any;
  setExpandDict: Function;
  row: any;
  style: any;
}

export const TableRow: React.FC<RowProps> = (props) => {
  const {
    cellGrid = false,
    columns,
    expandableRow,
    expandDict,
    onRowClick,
    row,
    setExpandDict,
    style,
    useRowExpander,
  } = props;

  // ----------------------------------
  //      Expand Row Logic
  // ----------------------------------
  const expandRow = (row: RowContainer) => {
    if (expandableRow && expandableRow(row.datum)) {
      setExpandDict(mergeObjects(expandDict, { [row.id]: true }));
    }
  };

  const toggleRow = (row: RowContainer) => {
    if (expandableRow && expandableRow(row.datum)) {
      setExpandDict(
        mergeObjects(expandDict, { [row.id]: !expandDict[row.id] })
      );
    }
  };

  const handleRowClick = (row: RowContainer) => {
    onRowClick && onRowClick(row);
  };

  const getExpandIconClass = (row: RowContainer) => {
    if (expandableRow && expandableRow(row.datum)) {
      return expandDict[row.id]
        ? 'custom-table__expand-icon--icon custom-table__expand--up u-sec-ro--override'
        : 'custom-table__expand-icon--icon custom-table__expand--down u-sec-ro--override';
    }
    return 'custom-table__expand-icon--icon u-sec-ro--override';
  };

  // ----------------------------------
  //      Styles
  // ----------------------------------
  const getRowHighlight = (row: RowContainer) => {
    return expandDict[row.id] ? 'custom-table--highlight' : '';
  };

  const getCellGrid = () => {
    return cellGrid ? 'custom-table__row--no-gutters' : '';
  };

  const getRowClass = (row: RowContainer) => {
    return `custom-table__row ${getRowHighlight(
      row
    )} ${getCellGrid()}${onRowClick ? 'custom-table__row--pointer' : ''}`;
  };

  const renderExpandIcon = (row: RowContainer) => (
    <button
      type="button"
      className="icon-button no-print"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        toggleRow(row);
      }}
    >
      <Icon
        name="chevronRight"
        title="Expand/Collapse Row"
        className={getExpandIconClass(row)}
      />
    </button>
  );

  const cellClass = cellGrid
    ? 'custom-table__cell custom-table__cell--grid'
    : 'custom-table__cell';

  const renderCell = (col: TableColumnProps, row: RowContainer) => {
    const colStyle = getColStyle(columns, col);
    const cell = col.cell
      ? col.cell(row.datum)
      : typeof col.selector === 'string'
      ? prop(col.selector, row.datum)
      : typeof col.selector === 'function'
      ? col.selector(row.datum)
      : prop(col.name, row.datum);

    return (
      <div
        aria-label={col.name}
        className={cellClass}
        key={col.name ? col.name : randomString()}
        style={colStyle}
        onClick={(e: React.MouseEvent) => {
          if (col.ignoreRowClick) {
            e.stopPropagation();
          }
        }}
      >
        {cell}
      </div>
    );
  };

  // only add onclick handlers if onRowClick is provided
  return onRowClick ? (
    <div
      aria-label="Table Row"
      style={style}
      className={getRowClass(row)}
      onClick={() => handleRowClick(row.datum)}
      onFocus={() => expandRow(row)}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) =>
        e.keyCode === 13 && handleRowClick(row.datum)
      }
    >
      {useRowExpander &&
        (expandableRow && expandableRow(row.datum) ? (
          <div className="custom-table__expand-icon">
            {renderExpandIcon(row)}
          </div>
        ) : (
          <div className="custom-table__expand-icon" />
        ))}
      {map(columns, (col: TableColumnProps) => renderCell(col, row))}
    </div>
  ) : (
    <div
      style={style}
      className={getRowClass(row)}
      onFocus={() => expandRow(row)}
      tabIndex={-1}
    >
      {useRowExpander &&
        (expandableRow && expandableRow(row.datum) ? (
          <div className="custom-table__expand-icon">
            {renderExpandIcon(row)}
          </div>
        ) : (
          <div className="custom-table__expand-icon" />
        ))}
      {map(columns, (col: TableColumnProps) => renderCell(col, row))}
    </div>
  );
};

