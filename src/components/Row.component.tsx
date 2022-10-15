import React from 'react'
import { prop, randomString } from '../util/objectUtility'
import {
  TableComponentProps,
  TableColumnProps,
} from './Table.component'
import { getColStyle } from './ColumnLabels.component'

interface RowProps extends TableComponentProps {
  row: any
  style: any
}

export const TableRow: React.FC<RowProps> = ({
  cellGrid = false,
  columns,
  onRowClick,
  row,
  style,
}) => {
  const handleRowClick = (row: any) => {
    onRowClick && onRowClick(row)
  }

  const getCellGrid = () => {
    return cellGrid ? 'custom-table__row--no-gutters' : ''
  }

  const getRowClass = (_row: any) => {
    return `custom-table__row ${getCellGrid()}${
      onRowClick ? 'custom-table__row--pointer' : ''
    }`
  }

  const cellClass = cellGrid
    ? 'custom-table__cell custom-table__cell--grid'
    : 'custom-table__cell'

  const renderCell = (col: TableColumnProps, row: any) => {
    const colStyle = getColStyle(columns, col)
    const cell = col.cell
      ? col.cell(row)
      : typeof col.selector === 'string'
      ? prop(col.selector, row)
      : typeof col.selector === 'function'
      ? col.selector(row)
      : prop(col.name, row)

    return (
      <div
        aria-label={col.name}
        className={cellClass}
        key={col.name ? col.name : randomString()}
        style={colStyle}
        onClick={(e: React.MouseEvent) => {
          if (col.ignoreRowClick) {
            e.stopPropagation()
          }
        }}
      >
        {cell}
      </div>
    )
  }

  // only add onclick handlers if onRowClick is provided
  return onRowClick ? (
    <div
      aria-label="Table Row"
      className={getRowClass(row)}
      onClick={() => handleRowClick(row)}
      style={style}
    >
      {columns.map((col: TableColumnProps) => renderCell(col, row))}
    </div>
  ) : (
    <div
      className={getRowClass(row)}
      style={style}
    >
      {columns.map((col: TableColumnProps) => renderCell(col, row))}
    </div>
  )
}
