import React from 'react'
import { ConditionalRowStyle, TableComponentProps } from './Table.component'
import { FixedSizeList as List } from 'react-window'
import { TableRow } from './Row.component'

interface TableBodyProps extends TableComponentProps {
  rows: any[]
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const { conditionalRowStyles, rows } = props

  const getConditionalStyle = (row: any): React.CSSProperties =>
    conditionalRowStyles
      ? conditionalRowStyles.reduce(
          (acc: React.CSSProperties, curr: ConditionalRowStyle) =>
            curr.when(row) ? { ...acc, ...curr.style } : acc,
          {}
        )
      : {}

  return (
    <div>
      <List
        height={window.innerHeight - 70}
        itemCount={rows.length}
        itemSize={46}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>
            <TableRow
              {...props}
              row={rows[index]}
              conditionalStyles={getConditionalStyle(rows[index])}
            />
          </div>
        )}
      </List>
    </div>
  )
}
