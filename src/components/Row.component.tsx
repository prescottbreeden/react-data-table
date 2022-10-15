import React from 'react'
import { TableComponentProps, TableColumnProps } from './Table.component'
import { getColStyle } from './ColumnLabels.component'

const randomString = () => {
  return Math.random().toString(36).substring(7);
};

interface RowProps extends TableComponentProps {
  row: any
  style: any
}

export const TableRow: React.FC<RowProps> = ({ columns, row, style }) => {
  const renderCell = (col: TableColumnProps, row: any) => {
    const colStyle = getColStyle(col)
    const cell = col.cell
      ? col.cell(row)
      : typeof col.selector === 'string'
      ? row[col.selector]
      : typeof col.selector === 'function'
      ? col.selector(row)
      : row[col.name]

    return (
      <span
        aria-label={col.name}
        key={col.name ? col.name : randomString()}
        style={{
          ...colStyle,
          border: '1px solid black',
          display: 'inline-block',
          width: '400px',
          padding: '10px',
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
