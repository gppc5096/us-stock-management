import React, { useState } from 'react';
import { useCurrencyConversion } from '../../hooks/useCurrencyConversion';

const CURRENCIES = ['USD', 'KRW', 'EUR', 'JPY', 'CNY'];

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('KRW');

  const { convertedAmount, loading, error } = useCurrencyConversion(
    amount,
    fromCurrency,
    toCurrency
  );

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">환율 변환</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 금액 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            금액
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="0"
            step="0.01"
          />
        </div>

        {/* 통화 선택 */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변환 전
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwapCurrencies}
            className="mt-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            ⇄
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변환 후
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 결과 표시 */}
      <div className="mt-6">
        {loading && <p className="text-gray-600">변환 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {convertedAmount !== null && !loading && !error && (
          <div className="text-lg">
            <span className="font-medium">
              {amount.toLocaleString()} {fromCurrency}
            </span>
            {' = '}
            <span className="font-medium">
              {convertedAmount.toLocaleString()} {toCurrency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter; 