import React, { PropsWithChildren } from "react";
import BootstrapTable from "react-bootstrap/Table";

interface Props<ObjectType> {
  items: ObjectType[];
  columns: {
    key: keyof ObjectType & string;
    title: string;
  }[];
}

function Table<ObjectType extends { id: number }>({
  items,
  columns,
}: PropsWithChildren<Props<ObjectType>>) {
  return (
    <BootstrapTable striped>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} data-testid="rate-row">
            {columns.map((column) => (
              <td key={column.key}>{item[column.key as string]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </BootstrapTable>
  );
}

export default Table;
