interface ExchangeRateResponse {
  rates: {
    [key: string]: number;
  };
  base: string;
  date: string;
}

class CurrencyService {
  private cache: Map<string, { rate: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1시간

  async getExchangeRate(from: string, to: string): Promise<number> {
    const cacheKey = `${from}-${to}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      return cachedData.rate;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_EXCHANGE_RATE_API_URL}/${from}`
      );
      const data: ExchangeRateResponse = await response.json();
      const rate = data.rates[to];

      this.cache.set(cacheKey, {
        rate,
        timestamp: Date.now(),
      });

      return rate;
    } catch (error) {
      console.error('환율 정보를 가져오는데 실패했습니다:', error);
      throw error;
    }
  }
}

export const currencyService = new CurrencyService();
