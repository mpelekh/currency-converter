import React from "react";
import { render, screen } from "@testing-library/react";
import {
  ConversionRatesContext,
  ConversionRatesContextValue,
} from "providers/ConversionRatesProvider";
import App from "./App";

describe("App component", () => {
  const renderApp = (contextValue: ConversionRatesContextValue) => {
    return render(
      <ConversionRatesContext.Provider value={contextValue}>
        <App />
      </ConversionRatesContext.Provider>
    );
  };

  test("should render without error dialog", () => {
    const contextValue: ConversionRatesContextValue = {
      error: null,
      convertCurrencyFrom: "USD",
      convertCurrencyTo: "BRL",
      rates: [
        {
          id: 11,
          from: "USD",
          to: "BRL",
          rate: 5.5,
          time: "12:00:00",
        },
      ],
    };
    renderApp(contextValue);

    // Check if the header exists and is correct
    expect(
      screen.getByText(/usd \/ brl currency conversion rates/i)
    ).toBeInTheDocument();

    // Check if the rate's row includes appropriate data
    const rateRow = screen.getByTestId("rate-row");
    expect(rateRow).toHaveTextContent("USD/BRL");
    expect(rateRow).toHaveTextContent("5.5");
    expect(rateRow).toHaveTextContent("12:00:00");

    // Check that there is no error dialog
    expect(screen.queryByText(/Oops/i)).not.toBeInTheDocument();
  });

  test("should render with error dialog", () => {
    const contextValue: ConversionRatesContextValue = {
      error: "test error happened",
      convertCurrencyFrom: "USD",
      convertCurrencyTo: "BRL",
      rates: [],
    };
    renderApp(contextValue);

    // Check that there is no rate's row
    expect(screen.queryByTestId("rate-row")).not.toBeInTheDocument();

    // Check that there is an error dialog
    const errorDialog = screen.getByTestId("error-modal");
    expect(errorDialog).toBeInTheDocument();
    expect(errorDialog).toHaveTextContent(/test error happened/i);
  });
});
