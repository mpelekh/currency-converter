import {
  ConversionRatesService,
  ConversionRate,
} from "services/conversionRatesService";

export interface SubscriptionOptions {
  intervalMs: number;
  convertCurrencyFrom: string;
  convertCurrencyTo: string;
  setRates: (handler: (rates: ConversionRate[]) => ConversionRate[]) => void;
  handleError: (error: Error) => void;
}

export const subscribeToRateUpdates = async ({
  intervalMs,
  convertCurrencyFrom,
  convertCurrencyTo,
  setRates,
  handleError,
}: SubscriptionOptions) => {
  try {
    const rateData = await ConversionRatesService.getConversionRates(
      convertCurrencyFrom,
      convertCurrencyTo
    );
    setRates(() => [rateData]);
  } catch (error) {
    handleError(error as Error);
    return () => {};
  }

  const intervalId = setInterval(async () => {
    let rateData: ConversionRate;

    try {
      rateData = await ConversionRatesService.getConversionRates(
        convertCurrencyFrom,
        convertCurrencyTo
      );
    } catch (error) {
      handleError(error as Error);
      clearInterval(intervalId!);
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
  }, intervalMs);

  return () => clearInterval(intervalId);
};
