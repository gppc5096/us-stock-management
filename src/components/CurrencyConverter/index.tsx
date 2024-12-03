import React, { useState, useEffect } from 'react';
import { formatters } from '../../utils/formatters';

interface ExchangeRate {
  rate: number;
  timestamp: Date;
}

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    rate: 1300,
    timestamp: new Date()
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      // 실제 API 호출 (예시: Exchange Rate API)
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const data = await response.json();
      
      setExchangeRate({
        rate: data.rates.KRW,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('환율 정보 조회 실패:', error);
      // 에러 시 기본 환율 사용
      setExchangeRate(prev => ({
        ...prev,
        timestamp: new Date()
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    // 1분마다 환율 업데이트
    const interval = setInterval(fetchExchangeRate, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const convertedAmount = Number(amount) * exchangeRate.rate;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">실시간 환율 변환기</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="USD 금액 입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-lg font-semibold">USD</div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-2xl text-gray-400">↓</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={amount ? formatters.number.format(convertedAmount) : ''}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
              placeholder="KRW 환산 금액"
            />
          </div>
          <div className="text-lg font-semibold">KRW</div>
        </div>

        <div className="text-sm text-gray-500 text-center space-y-1">
          <div>
            적용 환율: 1 USD = {formatters.number.format(exchangeRate.rate)} KRW
          </div>
          <div className="text-xs">
            {loading ? '환율 업데이트 중...' : 
              `마지막 업데이트: ${exchangeRate.timestamp.toLocaleTimeString()}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter; 