interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

class StockPriceService {
  private cache: Map<string, { data: StockQuote; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60; // 1분

  async getStockPrice(symbol: string): Promise<StockQuote> {
    const cachedData = this.cache.get(symbol);
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      return cachedData.data;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_ALPHA_VANTAGE_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      const quote = data['Global Quote'];
      const stockQuote: StockQuote = {
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        lastUpdated: new Date()
      };

      this.cache.set(symbol, {
        data: stockQuote,
        timestamp: Date.now()
      });

      return stockQuote;
    } catch (error) {
      console.error(`Failed to fetch stock price for ${symbol}:`, error);
      throw error;
    }
  }
}

export const stockPriceService = new StockPriceService(); 