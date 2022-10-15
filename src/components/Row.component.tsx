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
  columns,
  row,
  style,
}) => {
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
      <span
        aria-label={col.name}
        key={col.name ? col.name : randomString()}
        style={{
          ...colStyle,
          border: '1px solid black',
          display: 'inline-block',
          width: '400px',
          padding: '10px'
        }}
      >
        {cell}
      </span>
    )
  }

  return (
    <div style={style}>
      {columns.map((col: TableColumnProps) => renderCell(col, row))}
    </div>
  )
}
