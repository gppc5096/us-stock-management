import React, { useState, useEffect } from 'react';
import { formatters } from '../../utils/formatters';

interface StockPrice {
  symbol: string;
  price: number;
  previousClose: number;
}

export const RealTimePriceTracker: React.FC = () => {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');

  // 초기 주식 데이터 설정
  useEffect(() => {
    const initialStocks = [
      { symbol: 'AAPL', price: 173.50, previousClose: 172.62 },
      { symbol: 'MSFT', price: 378.85, previousClose: 377.44 },
      { symbol: 'GOOGL', price: 134.99, previousClose: 134.31 }
    ];
    setStockPrices(initialStocks);
    setLoading(false);
  }, []);

  // 가격 변동 시뮬레이션 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrices(prevPrices => 
        prevPrices.map(stock => ({
          ...stock,
          previousClose: stock.price,
          price: stock.price * (1 + (Math.random() * 0.02 - 0.01))
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 새로운 종목 추가
  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol) return;

    const symbol = newSymbol.toUpperCase();
    if (stockPrices.some(stock => stock.symbol === symbol)) {
      alert('이미 추가된 종목입니다.');
      return;
    }

    const newStock = {
      symbol,
      price: 100 + Math.random() * 200, // 임시 초기 가격
      previousClose: 100 + Math.random() * 200
    };

    setStockPrices(prev => [...prev, newStock]);
    setNewSymbol('');
  };

  // 종목 제거
  const handleRemoveSymbol = (symbolToRemove: string) => {
    setStockPrices(prev => prev.filter(stock => stock.symbol !== symbolToRemove));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">실시간 주가 추적</h2>
      </div>

      {/* 종목 추가 폼 */}
      <form onSubmit={handleAddSymbol} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="종목 코드 입력 (예: AAPL)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            추가
          </button>
        </div>
      </form>

      {/* 주가 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stockPrices.map(stock => {
          const priceChange = stock.price - stock.previousClose;
          const changePercent = (priceChange / stock.previousClose) * 100;
          const isPositive = priceChange >= 0;

          return (
            <div key={stock.symbol} className="border rounded-lg p-4 relative">
              {/* 종료 버튼 */}
              <button
                onClick={() => handleRemoveSymbol(stock.symbol)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg"
              >
                ×
              </button>

              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                <span className={`text-sm px-2 py-1 rounded ${
                  isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isPositive ? '▲' : '▼'}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold">
                  {formatters.number.formatCurrency(stock.price, 'USD')}
                </p>
                <p className={`text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{formatters.number.formatCurrency(priceChange, 'USD')} 
                  ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealTimePriceTracker; 