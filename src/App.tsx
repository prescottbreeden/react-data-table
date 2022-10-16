import './App.css'
import { TableColumnProps } from './components/Table.component'
import { TableComponent as Table } from './components/Table.component'
import { fakedata } from './fake'
import { get } from 'lodash/fp'

const explore: { fields: string[] } = {
  fields: [
    '_id',
    'name',
    'address.street',
    'address.town',
    'address.postode',
    'dob',
    'score',
    'pets',
    'verified',
    'url',
    'salary',
    'description',
  ]
}

const columns: TableColumnProps[] = explore.fields.map(field => ({
  name: field,
  cell: get(field),
  selector: get(field),
}))

/**
 * to add conditional styles, drop this in as an example:
        conditionalRowStyles={[
          {
            style: { backgroundColor: 'pink' },
            when: ({ verified }) => verified === false,
          },
        ]}
 */
function App() {
  return (
    <div>
      <Table
        columns={columns}
        data={fakedata}
      />
    </div>
  )
}

export default App
