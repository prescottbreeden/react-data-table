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
  {
    name: 'Pets',
    cell: ({ pets }) => pets.join(', '),
    sortable: true,
    selector: ({ pets }) => pets.join(', '),
  },
  {
    name: 'Verified',
    cell: ({ verified }) => verified.toString(),
    sortable: true,
    selector: get('verified'),
  },
  {
    name: 'Url',
    cell: get('url'),
    sortable: true,
    selector: get('url'),
  },
  {
    name: 'Salary',
    cell: get('salary'),
    sortable: true,
    selector: get('salary'),
  },
]

function App() {
  return (
    <div>
      <Table columns={HEADERS} data={fakedata} />
    </div>
  )
}

export default App
