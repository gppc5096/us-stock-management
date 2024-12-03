import React, { useState, useEffect, useCallback } from 'react';
import { formatters } from '../../utils/formatters';
import { currencyService } from '../../services/currencyService';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 환율 가져오기
  const fetchExchangeRate = useCallback(async () => {
    try {
      setLoading(true);
      const rate = await currencyService.getExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(rate);
    } catch (error) {
      console.error('환율 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  // 통화 변경시 환율 갱신
  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    if (value === '') {
      setAmount('');
      setDisplayValue('0');
    } else {
      setAmount(value);
      setDisplayValue(formatters.number.formatCurrency(Number(value), fromCurrency));
    }
  };

  const handleFocus = () => {
    if (amount === '') {
      setDisplayValue('');
    }
  };

  const handleBlur = () => {
    if (amount === '') {
      setDisplayValue('0');
    }
  };

  const convertedAmount = Number(amount || 0) * (exchangeRate || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">환율 변환</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            금액
          </label>
          <input
            type="text"
            value={displayValue}
            onChange={handleAmountChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            변환 결과
          </label>
          <div className="px-3 py-2 border rounded bg-gray-50">
            {formatters.number.formatCurrency(convertedAmount, toCurrency)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작 통화
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="USD">USD (미국 달러)</option>
            <option value="KRW">KRW (대한민국 원)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            도착 통화
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="KRW">KRW (대한민국 원)</option>
            <option value="USD">USD (미국 달러)</option>
          </select>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-4">
        현재 환율: 1 {fromCurrency} = {exchangeRate ? formatters.number.format(exchangeRate) : '로딩 중...'} {toCurrency}
        {loading && <span className="ml-2">갱신 중...</span>}
      </div>
    </div>
  );
};

export default CurrencyConverter; 