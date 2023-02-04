import React, { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  ConversionRatesContext,
  ConversionRatesContextValue,
  ConversionRatesProvider,
  ConversionRatesProviderProps,
} from "./ConversionRatesProvider";

describe("ConversionRatesProvider component", () => {
  const server = setupServer(
    rest.get(
      "https://currency-converter5.p.rapidapi.com/currency/convert",
      (req, res, ctx) => {
        return res(
          ctx.json({
            base_currency_code: "USD",
            base_currency_name: "United States dollar",
            amount: "1.0000",
            updated_date: "2023-02-03",
            rates: {
              BRL: {
                currency_name: "Brazilian real",
                rate: "5.1234",
                rate_for_amount: "5.1234",
              },
            },
            status: "success",
          })
        );
      }
    )
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const customRender = (
    children: (value: ConversionRatesContextValue) => ReactNode,
    props: ConversionRatesProviderProps = {}
  ) => {
    return render(
      <ConversionRatesProvider {...props}>
        <ConversionRatesContext.Consumer>
          {children}
        </ConversionRatesContext.Consumer>
      </ConversionRatesProvider>
    );
  };

  test("should provide default data", () => {
    customRender((value) => {
      return <span>Received: {JSON.stringify(value)}</span>;
    });

    expect(screen.getByText(/received:/i).textContent).toBe(
      'Received: {"error":null,"convertCurrencyFrom":"USD","convertCurrencyTo":"BRL","rates":[]}'
    );
  });

  test("should provide obtained from API data", async () => {
    customRender((value) => {
      return (
        <>
          <span>Rates list length: {value.rates.length}.</span>
          <span>Rate value: {value.rates[0]?.rate}</span>
        </>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(/rates list length: 1/i)).toBeInTheDocument()
    );

    // Check if the obtained from the API value is provided
    expect(screen.getByText(/rate value: 5.1234/i)).toBeInTheDocument();
  });

  test("should provide an error in case of API failure", async () => {
    server.use(
      // Override the initial "GET /currency/convert" request handler
      // to return a 500 Server Error
      rest.get(
        "https://currency-converter5.p.rapidapi.com/currency/convert",
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    customRender((value) => {
      return <span>Error: {value.error}.</span>;
    });

    await waitFor(() =>
      expect(
        screen.getByText(/HTTP Error: 500 Internal Server Error/i)
      ).toBeInTheDocument()
    );
  });

  test("should provide not more than 24 last rates values", async () => {
    customRender(
      (value) => {
        return <span>Rates list length: {value.rates.length}.</span>;
      },
      { intervalMs: 10 }
    );

    await waitFor(() =>
      expect(screen.getByText(/rates list length: 24/i)).toBeInTheDocument()
    );

    // Ensure that no more than 24 rates values are in the list
    await expect(() =>
      waitFor(() =>
        expect(screen.getByText(/rates list length: 25/i)).toBeInTheDocument()
      )
    ).rejects.toThrow();
  });
});
