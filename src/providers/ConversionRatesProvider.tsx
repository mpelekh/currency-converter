import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { ConversionRate } from "services/conversionRatesService";
import { subscribeToRateUpdates } from "./conversionRatesSubscription";

const convertCurrencyFrom = process.env
  .REACT_APP_CONVERT_CURRENCY_FROM as string;
const convertCurrencyTo = process.env.REACT_APP_CONVERT_CURRENCY_TO as string;

export interface ConversionRatesContextValue {
  error: string | null;
  convertCurrencyFrom: string;
  convertCurrencyTo: string;
  rates: ConversionRate[];
}

export const ConversionRatesContext =
  React.createContext<ConversionRatesContextValue>({
    error: null,
    convertCurrencyFrom,
    convertCurrencyTo,
    rates: [],
  });

export interface ConversionRatesProviderProps {
  intervalMs?: number;
}

export const ConversionRatesProvider: FC<
  PropsWithChildren<ConversionRatesProviderProps>
> = ({ intervalMs, children }) => {
  const [rates, setRates] = useState<ConversionRate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscriptionRef: {
      unsubscribe: (() => void) | null;
    } = {
      unsubscribe: null,
    };

    (async () => {
      subscriptionRef.unsubscribe = await subscribeToRateUpdates({
        intervalMs:
          intervalMs ||
          1000 * 60 * 60 /* Pull  currency conversion rates every hour */,
        convertCurrencyFrom,
        convertCurrencyTo,
        setRates,
        handleError: (error: Error) => {
          setError(
            `Something went wrong. Please contact the administrator: ${error.message}.`
          );
        },
      });
    })();

    return () => {
      subscriptionRef.unsubscribe?.();
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
      {children}
    </ConversionRatesContext.Provider>
  );
};
