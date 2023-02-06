import {
  ConversionRatesService,
  ConversionRate,
} from "services/conversionRatesService";
import {
  subscribeToRateUpdates,
  SubscriptionOptions,
} from "./conversionRatesSubscription";

describe("subscribeToRateUpdates()", () => {
  let counter: number;
  let rates: ConversionRate[];
  let setRates: ReturnType<typeof jest.fn>;
  let handleError: ReturnType<typeof jest.fn>;
  let subscriptionOptions: SubscriptionOptions;
  let getConversationRatesMock: jest.SpyInstance<
    Promise<ConversionRate>,
    [from: string, to: string]
  >;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    counter = 1;
    rates = [];

    getConversationRatesMock = jest
      .spyOn(ConversionRatesService, "getConversionRates")
      .mockImplementation(async (from, to) => {
        const now = new Date();
        return {
          id: counter++,
          from,
          to,
          rate: 1234,
          time: now.toLocaleTimeString(),
        } as ConversionRate;
      });

    setRates = jest
      .fn()
      .mockImplementation(
        (fn: (rates: ConversionRate[]) => ConversionRate[]) =>
          (rates = fn(rates))
      );
    handleError = jest.fn();

    subscriptionOptions = {
      intervalMs: 10,
      convertCurrencyFrom: "USD",
      convertCurrencyTo: "BRL",
      setRates,
      handleError,
    };
  });

  test("should add new rate on top of the list", async () => {
    const unsubscribe = await subscribeToRateUpdates(subscriptionOptions);

    await waitFor(1000);

    expect(rates[0].id > rates[1].id).toBeTruthy();

    unsubscribe();
  });

  test("should have 24 rate values in the list", async () => {
    const unsubscribe = await subscribeToRateUpdates(subscriptionOptions);

    await waitFor(1000);

    expect(rates[0].id - rates[23].id + 1).toBe(24);

    unsubscribe();
  });

  test("should unsubscribe from rate updates", async () => {
    const unsubscribe = await subscribeToRateUpdates(subscriptionOptions);

    await waitFor(1000);

    const topRateId = rates[0].id;

    unsubscribe();

    await waitFor(500);

    expect(rates[0].id).toBe(topRateId);
  });

  test("shouldn't subscribe in case of error", async () => {
    getConversationRatesMock.mockImplementation(async () => {
      throw new Error("test error");
    });

    await subscribeToRateUpdates(subscriptionOptions);

    expect(getConversationRatesMock).toBeCalledTimes(1);
    expect(handleError).toBeCalled();
    expect(rates.length).toBe(0);
  });

  test("should unsubscribe in case of error", async () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    getConversationRatesMock.mockImplementation(async (from, to) => {
      if (counter === 3) {
        throw new Error("test error");
      }

      const now = new Date();
      return {
        id: counter++,
        from,
        to,
        rate: 1234,
        time: now.toLocaleTimeString(),
      } as ConversionRate;
    });

    await subscribeToRateUpdates(subscriptionOptions);

    await waitFor(1000);

    expect(handleError).toBeCalledTimes(1);
    expect(clearIntervalSpy).toBeCalledTimes(1);
    expect(rates.length).toBe(2);
  });
});

function waitFor(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
