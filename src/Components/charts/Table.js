import React from "react";
import { useTable } from "react-table";

export default function Table({ columns, data }) {
  // Dummy data to prevent errors before data is gathered
  if ( !data ) {
    data = [
        {
            "label": "sDt_Collapse_b0",
            "value": 7
        },
        {
            "label": "sDt_Complete_b0",
            "value": 4
        },
        {
            "label": "sCt_Res30_b0",
            "value": 5
        },
        {
          "label": "Sauid",
          "value": 1
      }
    ]
  }

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups if your table have groupings
    rows, // rows for the table based on the data passed
    prepareRow // Prepare the row (this function need to called for each row before getting the row props)
  } = useTable({
    columns,
    data
  });
  
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}