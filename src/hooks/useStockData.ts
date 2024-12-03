import { useState, useEffect, useCallback } from 'react';

interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
}

interface UseStockDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useStockData(
  symbol: string,
  options: UseStockDataOptions = {}
) {
  const {
    autoRefresh = true,
    refreshInterval = 60000 // 1분
  } = options;

  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStockData = useCallback(async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.REACT_APP_ALPHA_VANTAGE_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const result = await response.json();

      if (result['Error Message']) {
        throw new Error(result['Error Message']);
      }

      const quote = result['Global Quote'];
      
      // 추가 회사 정보 가져오기
      const companyResponse = await fetch(
        `${process.env.REACT_APP_ALPHA_VANTAGE_API_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
      );
      
      const companyData = await companyResponse.json();

      const stockData: StockData = {
        symbol,
        companyName: companyData.Name || symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        marketCap: parseFloat(companyData.MarketCapitalization) || 0,
        volume: parseInt(quote['06. volume']),
        peRatio: parseFloat(companyData.PERatio) || 0,
        week52High: parseFloat(companyData['52WeekHigh']) || 0,
        week52Low: parseFloat(companyData['52WeekLow']) || 0
      };

      setData(stockData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '주식 데이터를 가져오는데 실패했습니다.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  // 초기 데이터 로딩 및 자동 새로고침 설정
  useEffect(() => {
    fetchStockData();

    if (autoRefresh) {
      const interval = setInterval(fetchStockData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchStockData, autoRefresh, refreshInterval]);

  // 수동 새로고침 함수
  const refresh = () => {
    fetchStockData();
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}
