import React from 'react'
import { FixedSizeList as List } from 'react-window'
import { reduce } from 'lodash'
import { TableRow } from './Row.component'
import { ConditionalRowStyle, TableComponentProps } from './Table.component'

interface TableBodyProps extends TableComponentProps {
  rows: any[]
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const { conditionalRowStyles, rows } = props

  const getConditionalStyle = (row: any) => {
    const output = { style: {} }
    if (conditionalRowStyles) {
      reduce(
        conditionalRowStyles,
        (acc: { style: any }, curr: ConditionalRowStyle) => {
          if (curr.when(row)) {
            acc.style = {
              ...acc.style,
              ...curr.style,
            }
          }
          return acc
        },
        output
      )
    }
    return output
  }

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
              style={getConditionalStyle(rows[index])}
            />
          </div>
        )}
      </List>
    </div>
  )
}
