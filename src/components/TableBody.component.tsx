import React from 'react';
import { map, reduce } from 'lodash';
import { TableRow } from './Row.component';
import {
  ConditionalRowStyle,
  RowContainer,
  TableComponentProps,
} from './Table.component';

interface TableBodyProps extends TableComponentProps {
  rows: any[];
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const { conditionalRowStyles, rows } = props;

  const getConditionalStyle = (row: any) => {
    const output = { style: {} };
    if (conditionalRowStyles) {
      reduce(
        conditionalRowStyles,
        (acc: { style: any }, curr: ConditionalRowStyle) => {
          if (curr.when(row)) {
            acc.style = {
              ...acc.style,
              ...curr.style,
            };
          }
          return acc;
        },
        output
      );
    }
    return output;
  };

  return (
    <div className="custom-table__body">
      {map(rows, (row: RowContainer) => {
        const { style } = getConditionalStyle(row.datum);
        return (
          <React.Fragment key={row.id}>
            <TableRow {...props} row={row} style={style} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

