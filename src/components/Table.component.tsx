import React from 'react'
import { sortBy, reverse } from 'lodash'
import { ColumnLabels } from './ColumnLabels.component'
import { TableBody } from './TableBody.component'

export interface TableComponentProps {
  cellGrid?: boolean
  columns: TableColumnProps[]
  conditionalRowStyles?: ConditionalRowStyle[]
  data?: any[]
  displayColumnLabels?: boolean
  noDataComponent?: JSX.Element
  onRowClick?: (row: any) => void | any
  paginate?: boolean
  paginationQuantity?: number
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
  sort?: any
  style?: any
  width?: string
}

export interface ConditionalRowStyle {
  style: any
  when: (row: any) => boolean
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
 * @prop noDataComponent JSX.Element to render if data is empty
 * @prop onRowClick Function that executes when a row is interacted with
 */
export const TableComponent: React.FC<TableComponentProps> = (props) => {
  const {
    columns,
    data = [],
    displayColumnLabels = true,
    noDataComponent,
    paginate,
    paginationQuantity = 25,
  } = props

  // ----------------------------------
  //      State Management
  // ----------------------------------
  // pagination
  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const [chunk, setChunk] = React.useState<number>(paginationQuantity)
  const [pagination, setPagination] = React.useState<any[]>([])
  const pages = data && data.length ? Math.ceil(data.length / chunk) : 1

  // column sorting
  const [sortedColumn, setSortedColumn] = React.useState<number>(-1)
  const [reverseSort, setReverseSort] = React.useState<boolean>(false)

  // ----------------------------------
  //      Sorting Logic
  // ----------------------------------
  const sort = (data: any[]) => {
    if (sortedColumn === -1) {
      return data
    }
    const selector = columns[sortedColumn].selector
    if (!selector) {
      return data
    } else {
      const sorted = sortBy(
        data,
        (row: any) =>
          typeof selector === 'string'
            ? row[selector] // selector is property
            : selector(row) // selector is function
      )
      return (reverseSort)
        ? reverse(sorted)
        : sorted
      }
  }

  const toggleReverseSort = () => {
    // TODO this should be a single object with both reverse and column info
    // so state updates can check if the column being sorted has changed
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
    const newPage =
      pageNumber === 1
        ? pages
        : pageNumber - 1
    setPageNumber(newPage)
  }

  const nextPage = () => {
    const newPage = pageNumber === pages ? 1 : pageNumber + 1
    setPageNumber(newPage)
  }

  const getPageNumberData = () => {
    const start = (pageNumber - 1) * chunk + 1
    const end = pageNumber === pages ? data!.length : pageNumber * chunk
    return `${start}-${end} of ${data!.length}`
  }

  // ----------------------------------
  //      Side Effects
  // ----------------------------------

  // Pagination
  React.useEffect(() => {
    if (paginate && data && data.length) {
      const view = data.slice((pageNumber - 1) * chunk, pageNumber * chunk)
      setPagination(view)
      if (view.length === 0) {
        setPageNumber(1)
      }
    }
  }, [chunk, data, pageNumber, paginate])

  // ----------------------------------
  //      JSX component
  // ----------------------------------
  return (
    <>
      {data && data.length ? (
        <div style={{ width: `${columns.length * 425}px` }}>
          {displayColumnLabels && (
            <ColumnLabels
              {...props}
              reverseSort={reverseSort}
              rows={data}
              setSortedColumn={setSortedColumn}
              sortedColumn={sortedColumn}
              toggleReverseSort={toggleReverseSort}
            />
          )}
          <TableBody
            {...props}
            rows={paginate ? sort(pagination) : sort(data)}
          />
          {paginate && data.length > 25 && (
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
                <button onClick={previousPage}>
                  Prev
                </button>
                <button onClick={nextPage}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : noDataComponent ? (
        noDataComponent
      ) : (
        <div>
          <p>No records were found.</p>
        </div>
      )}
    </>
  )
}
