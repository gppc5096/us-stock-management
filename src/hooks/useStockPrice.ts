import { useState, useEffect, useCallback } from 'react';
import { stockPriceService } from '../services/stockPriceService';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export function useStockPrice(symbol: string, refreshInterval = 60000) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockPrice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockPriceService.getStockPrice(symbol);
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '가격 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStockPrice, refreshInterval]);

  return { quote, loading, error, refetch: fetchStockPrice };
} 