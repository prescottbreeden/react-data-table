import React from 'react'
import { TableColumnProps, TableComponentProps } from './Table.component'
import { startCase } from 'lodash'

export const getColStyle = (col: TableColumnProps) => {
  const { style, center, width } = col
  const defaultWidth = 400

  const getStyleWidth = () => {
    if (style && style.width) {
      return style.width
    }
    if (width) {
      return width
    }
    return `${defaultWidth}px`
  }

  const withWidth = {
    ...style,
    width: getStyleWidth(),
  }

  const withCenter = center
    ? {
        ...withWidth,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }
    : withWidth

  return withCenter
}

export interface ColumnProps extends TableComponentProps {
  rows: any[]
  reverseSort: boolean
  setSortedColumn: Function
  sortedColumn: number
  toggleReverseSort: Function
}

export const ColumnLabels: React.FC<ColumnProps> = (props) => {
  const {
    columns,
    reverseSort,
    setSortedColumn,
    sortedColumn,
    toggleReverseSort,
  } = props

  const handleClick = (index: number) => {
    setSortedColumn(index)
    toggleReverseSort()
  }

  const renderLabel = (col: TableColumnProps) => {
    if (typeof col.label === 'function') {
      return col.label()
    } else if (typeof col.label === 'string') {
      return col.label
    } else {
      return startCase(col.name)
    }
  }

  return (
    <>
      {columns.map((col: TableColumnProps, index: number) => {
        const colStyle = getColStyle(col)
        const isCenter = 'center' in col
        const base = {
          ...colStyle,
          border: '1px solid black',
          display: 'inline-block',
          fontWeight: 'bold',
          padding: '10px',
        }
        const colLabel = isCenter ? { ...base, textAlign: 'center' } : base

        return (
          <span key={`${col.name}-${index}`} style={colLabel}>
            <span>{renderLabel(col)}</span>
            <button
              style={{ margin: '0 5px', padding: '2px 9px' }}
              onClick={() => handleClick(index)}
            >
              sort me
            </button>
            {sortedColumn === index &&
              (reverseSort ? <span>&darr;</span> : <span>&uarr;</span>)}
          </span>
        )
      })}
    </>
  )
}
