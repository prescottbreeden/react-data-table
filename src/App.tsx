import './App.css'
import { TableColumnProps } from './components/Table.component'
import { TableComponent as Table } from './components/Table.component'
import { fakedata } from './fake'
import { get } from 'lodash/fp'

const HEADERS: TableColumnProps[] = [
  {
    name: 'Name',
    cell: get('name'),
    sortable: true,
    selector: get('name'),
  },
  {
    name: 'DOB',
    cell: get('dob'),
    sortable: true,
    selector: get('dob'),
  },
  {
    name: 'Score',
    cell: get('score'),
    sortable: true,
    selector: get('score'),
  },
  {
    name: 'Email',
    cell: get('email'),
    sortable: true,
    selector: get('email'),
  },
]

function App() {
  return (
    <div>
      <Table
        cellGrid
        columns={HEADERS}
        data={fakedata}
      />
    </div>
  )
}

export default App
