import React from 'react';
import { map, reduce } from 'lodash';
import { CollapsibleList } from '@rmwc/list';
import { TableRow } from './Row.component';
import {
  ConditionalRowStyle,
  RowContainer,
  TableComponentProps,
} from './Table.component';

interface TableBodyProps extends TableComponentProps {
  rows: any[];
  expandDict: any;
  setExpandDict: Function;
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const { conditionalRowStyles, rows, expandDict, expandableRow } = props;

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
            {expandableRow && (
              <CollapsibleList
                key={row.id}
                open={expandDict[row.id]}
                handle={<React.Fragment />}
              >
                <div className="custom-table__expand">
                  {expandableRow(row.datum)}
                </div>
              </CollapsibleList>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

