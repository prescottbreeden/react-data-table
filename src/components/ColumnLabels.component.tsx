import React from 'react';
import { map } from 'lodash';
import {
  TableColumnProps,
  TableComponentProps,
  RowContainer,
} from './Table.component';
import { getColStyle } from './tableHelpers';
import { Icon } from './Icon';

interface ColumnProps extends TableComponentProps {
  rows: RowContainer[];
  reverseSort: boolean;
  setSortedColumn: Function;
  sortedColumn: number;
  toggleReverseSort: Function;
}

export const ColumnLabels: React.FC<ColumnProps> = (props) => {
  const {
    columns,
    reverseSort,
    rows,
    setSortedColumn,
    sortedColumn,
    toggleReverseSort,
    useRowExpander,
  } = props;

  const getSortIcon = (col: TableColumnProps, index: number) => {
    if (sortedColumn === index && !reverseSort) {
      return {
        name: 'arrowDropUp',
        tooltip: `Sort table by '${col.name}' ascending.`,
      };
    }
    return {
      name: 'arrowDropDown',
      tooltip: `Sort table by '${col.name}' descending.`,
    };
  };

  const handleClick = (index: number) => {
    setSortedColumn(index);
    toggleReverseSort();
  };

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    e.preventDefault();
    (e.key === 'Enter' || e.key === ' ') && handleClick(index);
  };

  const renderIcon = (col: TableColumnProps, index: number) => {
    const sortIcon = getSortIcon(col, index);
    return (
      <button
        className="custom-table__sort-button no-print"
        onKeyPress={(e) => handleKeyPress(e, index)}
        onClick={() => handleClick(index)}
      >
        <span className="u-hide-text">{sortIcon.tooltip}</span>
        <Icon name={sortIcon.name} className="custom-table__sort-icon" />
      </button>
    );
  };

  const renderLabel = (col: TableColumnProps, index: number) => {
    if (typeof col.label === 'function') {
      return (
        <React.Fragment>
          {col.label()}
          <span className="custom-table__sort-container">
            {col.sortable && rows.length > 1 && renderIcon(col, index)}
          </span>
        </React.Fragment>
      );
    }
    if (typeof col.label === 'string') {
      return (
        <React.Fragment>
          {col.label}
          <span className="custom-table__sort-container">
            {col.sortable && rows.length > 1 && renderIcon(col, index)}
          </span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {col.label ? col.label : col.name}
        <span className="custom-table__sort-container">
          {col.sortable && rows.length > 1 && renderIcon(col, index)}
        </span>
      </React.Fragment>
    );
  };

  return (
    <div className="custom-table__header">
      {useRowExpander && <div className="custom-table__expand-icon" />}
      {map(columns, (col: TableColumnProps, index: number) => {
        const colStyle = getColStyle(columns, col);
        const isCenter = 'center' in col;
        const base = {
          ...colStyle,
          fontWeight: 'bold',
          marginBottom: '.5rem',
          display: 'flex',
        };
        const colLabel = isCenter
          ? { ...base, justifyContent: 'center' }
          : base;

        return (
          <div className="custom-table__cell" key={index} style={colLabel}>
            <div className="custom-table__cell-label">
              {renderLabel(col, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

