export interface ConversionRate {
  id: number;
  from: string;
  to: string;
  rate: number;
  time: string;
}

interface ConversionRateResponse {
  base_currency_code: "string";
  base_currency_name: "string";
  amount: "string";
  updated_date: "string";
  rates: Record<
    string,
    {
      currency_name: string;
      rate: string;
      rate_for_amount: string;
    }
  >;
  status: "string";
}

export class ConversionRatesService {
  private static readonly baseUrl =
    "https://currency-converter5.p.rapidapi.com";
  private static readonly apiKey = process.env.REACT_APP_CURRENCY_CONVERTER_API_KEY as string;

  static async getConversionRates(
    from: string,
    to: string
  ): Promise<ConversionRate> {
    const response = await this.doRequest<ConversionRateResponse>(
      `currency/convert?format=json&from=${from}&to=${to}&amount=1`
    );
    const now = new Date();

    return {
      id: Number(now),
      from,
      to,
      rate: Number(response.rates[to].rate),
      time: now.toLocaleTimeString(),
    };
  }

  private static doRequest<ResponseDataType>(
    url: RequestInfo,
    init?: RequestInit
  ): Promise<ResponseDataType> {
    return fetch(`${this.baseUrl}/${url}`, {
      ...init,
      headers: {
        ...init?.headers,
        "X-RapidAPI-Key": this.apiKey,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    });
  }
}
