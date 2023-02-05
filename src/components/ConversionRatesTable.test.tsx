import React from "react";
import { render, screen } from "@testing-library/react";
import ConversionRatesTable from "./ConversionRatesTable";

describe("ConversionRatesTable component", () => {
  test("should render table head without rows with data", () => {
    render(<ConversionRatesTable rates={[]} />);

    const headers = ["Currency Pair", "Rate", "Time"];

    screen.getAllByRole("columnheader").forEach((header, index) => {
      expect(header).toHaveTextContent(headers[index]);
    });

    expect(screen.queryAllByRole("cell")).toStrictEqual([]);
  });

  test("should render table with appropriate data", () => {
    const rates = [
      {
        id: 111,
        from: "USD",
        to: "BRL",
        rate: 1.234,
        time: "12:00:00",
      },
      {
        id: 222,
        from: "USD",
        to: "UAH",
        rate: 36.9,
        time: "11:00:00",
      },
    ];
    render(<ConversionRatesTable rates={rates} />);

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
