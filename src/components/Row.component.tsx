import React from 'react'
import { TableComponentProps, TableColumnProps } from './Table.component'
import { getColStyle } from './ColumnLabels.component'

const truncate = (str: string) => 
  str.length > 44 ? str.slice(0, 44) + '...' : str

interface RowProps extends TableComponentProps {
  row: any
  style: any
}

export const TableRow: React.FC<RowProps> = ({
  conditionalRowStyles = [],
  columns,
  row,
  style,
}) => {
  const renderCell = (col: TableColumnProps, row: any) => {
    const conditional = conditionalRowStyles.reduce((acc, curr) => {
      return curr.when(row)
        ? {
            ...acc,
            ...curr.style,
          }
        : acc
    }, {})
    const colStyle = getColStyle(col)
    const cell = col.cell
      ? col.cell(row)?.toString()
      : typeof col.selector === 'string'
      ? row[col.selector]?.toString()
      : typeof col.selector === 'function'
      ? col.selector(row)
      : row[col.name]?.toString()

    return (
      <span
        aria-label={col.name}
        key={col.name}
        style={{
          border: '1px solid black',
          display: 'inline-block',
          width: '400px',
          padding: '10px',
          ...colStyle,
          ...conditional
        }}
      >
        {truncate(cell)}
      </span>
    )
  }

  return (
    <div style={style}>
      {columns.map((col: TableColumnProps) => renderCell(col, row))}
    </div>
  )
}
