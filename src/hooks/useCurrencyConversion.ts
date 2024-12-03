import { useState, useEffect } from 'react';
import { currencyService } from '../services/currencyService';

export function useCurrencyConversion(
  amount: number,
  from: string,
  to: string
) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const convertCurrency = async () => {
      try {
        setLoading(true);
        setError(null);
        const rate = await currencyService.getExchangeRate(from, to);
        setConvertedAmount(amount * rate);
      } catch (err) {
        setError('환율 변환 중 오류가 발생했습니다.');
        setConvertedAmount(null);
      } finally {
        setLoading(false);
      }
    };

    if (amount && from && to) {
      convertCurrency();
    }
  }, [amount, from, to]);

  return { convertedAmount, loading, error };
}
