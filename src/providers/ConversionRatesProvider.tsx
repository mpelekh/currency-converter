import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  ConversionRatesService,
  ConversionRate,
} from "services/conversionRatesService";

const convertCurrencyFrom = process.env
  .REACT_APP_CONVERT_CURRENCY_FROM as string;
const convertCurrencyTo = process.env.REACT_APP_CONVERT_CURRENCY_TO as string;

export const ConversionRatesContext = React.createContext<{
  error: string | null;
  convertCurrencyFrom: string;
  convertCurrencyTo: string;
  rates: ConversionRate[];
}>({
  error: null,
  convertCurrencyFrom,
  convertCurrencyTo,
  rates: [],
});

export const ConversionRatesProvider: FC<PropsWithChildren> = (props) => {
  const [rates, setRates] = useState<ConversionRate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const intervalRef: { intervalId: ReturnType<typeof setInterval> | null } = {
      intervalId: null,
    };
    const updateRates = async () => {
      const rateData = await ConversionRatesService.getConversionRates(
        convertCurrencyFrom,
        convertCurrencyTo
      );
      setRates([rateData]);
    };
    const handleError = (error: Error) => {
      setError(
        `Something went wrong. Please contact the administrator: ${error.message}.`
      );
    };

    updateRates()
      .then(() => {
        intervalRef.intervalId = setInterval(async () => {
          let rateData: ConversionRate;

          try {
            rateData = await ConversionRatesService.getConversionRates(
              convertCurrencyFrom,
              convertCurrencyTo
            );
          } catch (error) {
            debugger;
            handleError(error as Error);
            clearInterval(intervalRef.intervalId!);
            return;
          }

          setRates((rates) => {
            const newRates = [rateData, ...rates];

            // Print only last 24 hours to a page
            if (newRates.length > 24) {
              newRates.length = 24;
            }

            return newRates;
          });
        }, 1000 * 60 * 60 /* Pull  currency conversion rates every hour */);
      })
      .catch(handleError);

    return () => {
      intervalRef.intervalId && clearInterval(intervalRef.intervalId);
    };
  }, []);

  return (
    <ConversionRatesContext.Provider
      value={{
        error,
        convertCurrencyFrom,
        convertCurrencyTo,
        rates,
      }}
    >
      {props.children}
    </ConversionRatesContext.Provider>
  );
};
