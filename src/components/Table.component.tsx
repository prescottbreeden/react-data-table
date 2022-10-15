import React from 'react'
import { sortBy, reverse, get } from 'lodash'
import { randomString } from '../util/objectUtility'
import { ColumnLabels } from './ColumnLabels.component'
import { TableBody } from './TableBody.component'
import { IconButton } from './IconButton'

export const FlexRow: React.FC<any> = (props) => {
  return (
    <div {...props} className="form__row">
      {props.children}
    </div>
  )
}

export interface TableComponentProps {
  cellGrid?: boolean
  columns: TableColumnProps[]
  conditionalRowStyles?: ConditionalRowStyle[]
  data?: any[]
  displayColumnLabels?: boolean
  noDataComponent?: JSX.Element
  onRowClick?: (row: any) => void | any
  paginationQuantity?: number
  tableRowKey?: string
}

export type CellContainer = (row: any) => JSX.Element | string | null

export interface TableColumnProps {
  cell?: CellContainer
  center?: boolean
  ignoreRowClick?: boolean
  label?: string | JSX.Element | (() => string | JSX.Element)
  name: string
  selector?: string | ((row: any) => any)
  sortable?: boolean
  style?: any
  width?: string
}

export interface ConditionalRowStyle {
  style: any
  when: (row: any) => boolean
}

export type RowContainer = {
  datum: any
  id: any
}

export type ExpandDict = {
  [key: string]: boolean
}

/**
 * Component generating tables.  Import the TableColumnProps to help
 * assist the creation of your columns. Column name will generate labels for
 * each column, however you can also provide an optional label to provide more
 * flexibility and options for table generation. Column cell is a function that
 * should take the data row as an argument and return a JSX.Element or a string.
 * To make columns sortable, select sortable as true and provide either a string
 * or a function as the selector. Selector strings will be used for properter
 * lookups, whereas selector functions will sort based on the value of their
 * return. Use column center to automatically add styles that will center the
 * label and cells in the middle of the column, and width is a shorthand style
 * property that behaves the same as adding a style argument to the column. If
 * you want to create an excel-like table, use the cellGrid property on the
 * table component props.
 *
 * @prop cellGrid True/False if you want an excel-like grid-table
 * @prop columns Array of column attributes
 * @prop conditionalRowStyles Array of conditional styles
 * @prop data Array of data you want to display
 * @prop displayColumnLabels True/False if you want to show column labels
 * @prop expandableRow Function that returns a JSX.Element or null
 * @prop noDataComponent JSX.Element to render if data is empty
 * @prop onRowClick Function that executes when a row is interacted with
 * @prop tableRowKey a property of data that can generate a unique identifier for each row
 * @prop useRowExpander renders an icon that rotates as a row expands
 */
export const TableComponent: React.FC<TableComponentProps> = (props) => {
  const {
    columns,
    data = [],
    displayColumnLabels = true,
    noDataComponent,
    paginationQuantity = 25,
    tableRowKey,
  } = props

  // ----------------------------------
  //      State Management
  // ----------------------------------
  const [rows, setRows] = React.useState<RowContainer[]>()

  // pagination
  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const [chunk, setChunk] = React.useState<number>(paginationQuantity)
  const [pagination, setPagination] = React.useState<any[]>([])
  const pages = data && data.length ? Math.floor(data.length / chunk) + 1 : 1

  // column sorting
  const [sortedColumn, setSortedColumn] = React.useState<number>(-1)
  const [reverseSort, setReverseSort] = React.useState<boolean>(false)

  // ----------------------------------
  //      Sorting Logic
  // ----------------------------------
  const sort = (data: RowContainer[]) => {
    const selector = columns[sortedColumn].selector
    if (!selector) return
    const sorted = sortBy(data, (row: RowContainer) => {
      return typeof selector === 'string'
        ? row.datum[selector] // selector is property
        : selector(row.datum) // selector is function
    })
    if (reverseSort) {
      setRows(reverse(sorted))
    } else {
      setRows(sorted)
    }
  }

  const toggleReverseSort = () => {
    setReverseSort(!reverseSort)
  }

  // ----------------------------------
  //      Pagination Logic
  // ----------------------------------

  const handleChunkChange = (e: any) => {
    setChunk(e.target.value)
    setPageNumber(1)
  }

  const previousPage = () => {
    const newPage = pageNumber === 1 ? pages : pageNumber - 1
    setPageNumber(newPage)
  }

  const nextPage = () => {
    const newPage = pageNumber === pages ? 1 : pageNumber + 1
    setPageNumber(newPage)
  }

  const getPageNumberData = () => {
    const start = (pageNumber - 1) * chunk + 1
    const end = pageNumber === pages ? rows!.length : pageNumber * chunk
    return `${start}-${end} of ${rows!.length}`
  }

  // ----------------------------------
  //      Side Effects
  // ----------------------------------

  // Sorting
  React.useEffect(() => {
    sortedColumn !== -1 && rows && sort(rows)
  }, [sortedColumn, reverseSort]) // eslint-disable-line

  // Pagination
  React.useEffect(() => {
    if (rows && rows.length) {
      const r = rows.slice((pageNumber - 1) * chunk, pageNumber * chunk)
      setPagination(r)
      if (r.length === 0) {
        setPageNumber(1)
      }
    }
  }, [chunk, rows, pageNumber])

  // Rows
  React.useEffect(() => {
    if (!Array.isArray(data)) {
      return setRows([])
    }
    const containers = data.map((datum: any) => {
      const id = tableRowKey ? datum[tableRowKey] : randomString()
      return { id, datum }
    })
    return sortedColumn !== -1 ? sort(containers) : setRows(containers)
  }, [data, setRows, tableRowKey, sortedColumn]) // eslint-disable-line

  // ----------------------------------
  //      JSX component
  // ----------------------------------
  return (
    <React.Fragment>
      {rows && rows.length ? (
        <div className="custom-table">
          {displayColumnLabels && (
            <ColumnLabels
              {...props}
              reverseSort={reverseSort}
              rows={rows}
              setSortedColumn={setSortedColumn}
              sortedColumn={sortedColumn}
              toggleReverseSort={toggleReverseSort}
            />
          )}
          <TableBody
            {...props}
            rows={pagination}
          />
          {rows.length > 25 ? (
            <div className="custom-table__pagination">
              <div className="custom-table__push-right" />
              <label htmlFor="select-chunk">Rows per page:</label>
              <select
                id="select-chunk"
                className="custom-table__select-chunk"
                onChange={handleChunkChange}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
              <div className="custom-table__page-select">
                <p className="custom-table__page-select__page-data">
                  {getPageNumberData()}
                </p>
                <IconButton
                  name="chevronLeft"
                  onClick={previousPage}
                  tooltip="Previous Page"
                />
                <IconButton
                  name="chevronRight"
                  onClick={nextPage}
                  tooltip="Next Page"
                />
              </div>
            </div>
          ) : (
            <div className="u-flex">
              <div className="u-flex-grow-1" />
              <p className="custom-table__page-select__page-data">
                1 - {rows.length} of {rows.length}
              </p>
            </div>
          )}
        </div>
      ) : noDataComponent ? (
        noDataComponent
      ) : (
        <React.Fragment>
          <FlexRow>
            <p>No records were found.</p>
          </FlexRow>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
