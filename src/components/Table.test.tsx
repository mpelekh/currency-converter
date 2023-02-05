import React from "react";
import { render, screen } from "@testing-library/react";
import Table from "./Table";

describe("Table component", () => {
  const columns = [
    {
      key: "currencyPair" as const,
      title: "Currency Pair",
    },
    {
      key: "rate" as const,
      title: "Rate",
    },
    {
      key: "time" as const,
      title: "Time",
    },
  ];

  test("should render table head without rows with data", () => {
    render(<Table columns={columns} items={[]} />);

    screen.getAllByRole("columnheader").forEach((header, index) => {
      expect(header).toHaveTextContent(columns[index].title);
    });

    expect(screen.queryAllByRole("cell")).toStrictEqual([]);
  });

  test("should render table with appropriate data", () => {
    const items = [
      {
        id: 111,
        currencyPair: "USD/BRL",
        rate: 1.234,
        time: "12:00:00",
      },
      {
        id: 222,
        currencyPair: "USD/UAH",
        rate: 36.9,
        time: "11:00:00",
      },
    ];
    render(<Table columns={columns} items={items} />);

    const dataToCheck = [
      "USD/BRL",
      "1.234",
      "12:00:00",
      "USD/UAH",
      "36.9",
      "11:00:00",
    ];

    screen.getAllByRole("cell").forEach((cell, index) => {
      expect(cell).toHaveTextContent(dataToCheck[index]);
    });
  });
});
