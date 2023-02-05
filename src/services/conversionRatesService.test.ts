import { rest } from "msw";
import { setupServer } from "msw/node";
import { ConversionRatesService } from "./conversionRatesService";

describe("ConversionRatesService", () => {
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

  describe("getConversionRates()", () => {
    test("should return conversion rates", async () => {
      const fetchSpy = jest.spyOn(global, "fetch");
      const result = await ConversionRatesService.getConversionRates(
        "USD",
        "BRL"
      );

      expect(fetchSpy.mock.calls[0][0]).toBe(
        "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=USD&to=BRL&amount=1"
      );
      expect(fetchSpy.mock.calls[0][1]).toStrictEqual({
        headers: { "X-RapidAPI-Key": "put api key here" },
      });

      expect(typeof result.id).toBe("number");
      expect(result.from).toBe("USD");
      expect(result.to).toBe("BRL");
      expect(result.rate).toBe(5.1234);
      expect(result.time).toBe(new Date().toLocaleTimeString());

      fetchSpy.mockClear();
    });
  });
});
