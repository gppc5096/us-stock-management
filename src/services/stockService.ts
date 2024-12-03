import { BaseApi } from './api/BaseApi';

export interface Stock {
  symbol: string;
  companyName: string;
  sector?: string;
  industry?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp?: Date;
}

export interface StockFinancials {
  symbol: string;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
}

class StockService extends BaseApi {
  private readonly API_URL = process.env.REACT_APP_ALPHA_VANTAGE_API_URL;
  private readonly API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

  // 주식 기본 정보 조회
  async getStockInfo(symbol: string): Promise<Stock> {
    const url = `${this.API_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${this.API_KEY}`;
    const data = await this.fetchWithErrorHandling<any>(url);
    
    return {
      symbol: data.Symbol,
      companyName: data.Name,
      sector: data.Sector,
      industry: data.Industry
    };
  }

  // 실시간 시세 조회
  async getQuote(symbol: string): Promise<StockQuote> {
    const url = `${this.API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.API_KEY}`;
    const data = await this.fetchWithErrorHandling<any>(url);
    const quote = data['Global Quote'];

    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      timestamp: new Date(quote['07. latest trading day'])
    };
  }

  // 재무 정보 조회
  async getFinancials(symbol: string): Promise<StockFinancials> {
    const url = `${this.API_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${this.API_KEY}`;
    const data = await this.fetchWithErrorHandling<any>(url);

    return {
      symbol,
      marketCap: parseFloat(data.MarketCapitalization),
      peRatio: parseFloat(data.PERatio),
      dividendYield: parseFloat(data.DividendYield),
      week52High: parseFloat(data['52WeekHigh']),
      week52Low: parseFloat(data['52WeekLow'])
    };
  }

  // 여러 종목 시세 일괄 조회
  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      // 캐시 확인
      const cachedData = localStorage.getItem('stockQuotes');
      const cachedTime = localStorage.getItem('stockQuotesTime');
      
      if (cachedData && cachedTime) {
        const now = new Date().getTime();
        const cacheAge = now - Number(cachedTime);
        
        if (cacheAge < 5 * 60 * 1000) {
          return JSON.parse(cachedData);
        }
      }

      // 데모 데이터 생성
      const demoData = symbols.map(symbol => ({
        symbol,
        price: Math.random() * 1000 + 100,
        change: Math.random() * 20 - 10,
        changePercent: Math.random() * 5 - 2.5,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date()
      }));

      // 데모 데이터 캐싱
      localStorage.setItem('stockQuotes', JSON.stringify(demoData));
      localStorage.setItem('stockQuotesTime', String(new Date().getTime()));

      return demoData;

      /* 실제 API 연동시 사용할 코드 (axios 필요)
      const quotes = await Promise.all(
        symbols.map(async (symbol) => {
          const response = await fetch(`https://api.example.com/stocks/${symbol}`);
          const data = await response.json();
          return {
            symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume,
            timestamp: new Date(data.timestamp)
          };
        })
      );
      return quotes;
      */
    } catch (error) {
      console.error('Stock API Error:', error);
      throw new Error('주가 데이터를 가져오는데 실패했습니다.');
    }
  }

  // 종목 검색
  async searchStocks(query: string): Promise<Stock[]> {
    const url = `${this.API_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.API_KEY}`;
    const data = await this.fetchWithErrorHandling<any>(url);
    
    return data.bestMatches.map((match: any) => ({
      symbol: match['1. symbol'],
      companyName: match['2. name'],
      sector: undefined,
      industry: undefined
    }));
  }
}

export const stockService = new StockService();
